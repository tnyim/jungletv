package ipreputation

import (
	"bytes"
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"sync"
	"time"

	"github.com/jamesog/iptoasn"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

// Checker checks the reputation of IP addresses
type Checker struct {
	log            *log.Logger
	reputation     map[string]float32
	reputationLock sync.RWMutex
	httpClient     http.Client

	badASNs     map[int]struct{}
	badASNsLock sync.RWMutex

	endpoint string

	checkQueue chan string
}

// NewChecker initializes and returns a new Checker
func NewChecker(ctx context.Context, log *log.Logger, endpoint string) *Checker {
	c := &Checker{
		log:        log,
		reputation: make(map[string]float32),
		checkQueue: make(chan string, 10000),
		httpClient: http.Client{
			Timeout: 10 * time.Second,
		},

		badASNs: make(map[int]struct{}),

		endpoint: endpoint,
	}

	c.updateBadASNsFromDatabase(ctx)

	return c
}

func (c *Checker) CanReceiveRewards(remoteAddress string) bool {
	c.reputationLock.RLock()
	defer c.reputationLock.RUnlock()
	badActorConfidence, present := c.reputation[remoteAddress]
	if !present {
		c.EnqueueAddressForChecking(remoteAddress)
		return false // do not be generous and don't reward until they're checked
	}
	return badActorConfidence < 0.95
}

func (c *Checker) EnqueueAddressForChecking(remoteAddress string) {
	c.reputationLock.RLock()
	defer c.reputationLock.RUnlock()
	if _, present := c.reputation[remoteAddress]; present || remoteAddress == "" {
		return
	}
	// make this function never block by simply dropping the request if the queue is full
	select {
	case c.checkQueue <- remoteAddress:
		c.log.Printf("Enqueued remote address %s for reputation checking", remoteAddress)
	default:
	}
}

// provide either IP address or ASN
func (c *Checker) isBadASN(ip string, asn int) (bool, int, error) {
	if ip != "" {
		ipInfo, err := iptoasn.LookupIP(ip)
		if err != nil {
			return false, 0, stacktrace.Propagate(err, "")
		}
		asn = int(ipInfo.ASNum)
	}

	c.badASNsLock.RLock()
	defer c.badASNsLock.RUnlock()

	_, present := c.badASNs[asn]
	return present, asn, nil
}

func (c *Checker) Worker(ctx context.Context) {
	rateLimitTicker := time.NewTicker(10 * time.Second)
	defer rateLimitTicker.Stop()

	reloadBadASNsTicker := time.NewTicker(5 * time.Minute)
	defer reloadBadASNsTicker.Stop()

	for {
		select {
		case <-rateLimitTicker.C: // rate limit
			c.processQueueStep(ctx)
		case <-reloadBadASNsTicker.C:
			c.updateBadASNsFromDatabase(ctx)
		case <-ctx.Done():
			return
		}
	}
}

func (c *Checker) processQueueStep(ctx context.Context) {
	addressesToCheck := []string{}
	goingToCheck := make(map[string]struct{})
addLoop:
	for {
		select {
		case addressToCheck := <-c.checkQueue:
			addressAlreadyChecked := false
			func() {
				c.reputationLock.RLock()
				defer c.reputationLock.RUnlock()
				_, addressAlreadyChecked = c.reputation[addressToCheck]
			}()
			if _, present := goingToCheck[addressToCheck]; !present && !addressAlreadyChecked {
				goingToCheck[addressToCheck] = struct{}{}
				addressesToCheck = append(addressesToCheck, addressToCheck)
			}
			if len(addressesToCheck) >= 99 {
				break addLoop
			}
		default:
			break addLoop
		}
	}

	if len(addressesToCheck) > 0 {
		err := c.checkIPs(ctx, addressesToCheck)
		if err != nil {
			c.log.Println("error checking IP info:", stacktrace.Propagate(err, ""))
			for _, ip := range addressesToCheck {
				c.setAddressReputation(ip, 0.5)
			}
		}
	}
}

func (c *Checker) setAddressReputation(address string, reputation float32) {
	c.reputationLock.Lock()
	defer c.reputationLock.Unlock()
	c.reputation[address] = reputation
}

var asRegexp = regexp.MustCompile(`AS([0-9]+)\s.*`)

func (c *Checker) checkIPs(ctx context.Context, addressesToCheck []string) error {
	requestBody, err := json.Marshal(addressesToCheck)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.endpoint, bytes.NewBuffer(requestBody))
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	if resp.StatusCode != http.StatusOK {
		return stacktrace.NewError("non-200 status code when checking IP reputation")
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.log.Println("error reading response body:", stacktrace.Propagate(err, ""))
		return stacktrace.Propagate(err, "")
	}

	type result struct {
		Status  string `json:"status"`
		AS      string `json:"as"`
		Proxy   bool   `json:"proxy"`
		Hosting bool   `json:"hosting"`
		Query   string `json:"query"`
	}

	response := []result{}

	err = json.Unmarshal(body, &response)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	for _, result := range response {
		if result.Status != "success" {
			c.log.Printf("Could not check reputation for IP %v due to non-success status", result.Query)
			c.setAddressReputation(result.Query, 0.5)
			continue
		}
		asn, err := extractASN(result.AS)
		if err != nil {
			c.log.Printf("Could not determine AS number for IP %v: %v", result.Query, err)
		} else {
			isBadASN, _, err := c.isBadASN("", asn)
			if err != nil {
				return stacktrace.Propagate(err, "")
			}
			if isBadASN {
				c.log.Printf("IP %v is from disallowed ASN %d", result.Query, asn)
				c.setAddressReputation(result.Query, 1)
				continue
			}
		}

		if result.Proxy || result.Hosting {
			c.log.Printf("IP %v is bad actor", result.Query)
			c.setAddressReputation(result.Query, 1)
			continue
		}
		c.log.Printf("IP %v seems good", result.Query)
		c.setAddressReputation(result.Query, 0)
	}
	return nil
}

func (c *Checker) updateBadASNsFromDatabase(ctxCtx context.Context) {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		c.log.Printf("Failed to read bad ASNs from database: %v", stacktrace.Propagate(err, ""))
		return
	}
	defer ctx.Commit() // read-only tx

	badReputations, _, err := types.GetProxyASNumberReputations(ctx, nil)
	if err != nil {
		c.log.Printf("Failed to read bad ASNs from database: %v", stacktrace.Propagate(err, ""))
		return
	}

	badASNsMap := make(map[int]struct{})
	for _, r := range badReputations {
		badASNsMap[r.ASNumber] = struct{}{}
	}

	c.log.Printf("Loaded %d ASNs marked as disallowed", len(badASNsMap))

	c.badASNsLock.Lock()
	defer c.badASNsLock.Unlock()
	c.badASNs = badASNsMap
}

func extractASN(as string) (int, error) {
	matches := asRegexp.FindStringSubmatch(as)
	if len(matches) >= 2 {
		asn, err := strconv.Atoi(matches[1])
		if err != nil {
			return 0, stacktrace.Propagate(err, "")
		}
		return asn, nil
	}
	return 0, stacktrace.NewError("invalid AS string")
}

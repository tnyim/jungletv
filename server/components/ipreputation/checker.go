package ipreputation

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/jamesog/iptoasn"
	"github.com/palantir/stacktrace"
)

// Checker checks the reputation of IP addresses
type Checker struct {
	log            *log.Logger
	reputation     map[string]float32
	reputationLock sync.RWMutex
	httpClient     http.Client

	badASNs map[int]struct{}

	endpoint  string
	authToken string

	checkQueue chan string
}

// NewChecker initializes and returns a new Checker
func NewChecker(log *log.Logger, endpoint, authToken string, badASNs []int) *Checker {
	badASNsMap := make(map[int]struct{})
	for _, asn := range badASNs {
		badASNsMap[asn] = struct{}{}
	}
	return &Checker{
		log:        log,
		reputation: make(map[string]float32),
		checkQueue: make(chan string, 10000),
		httpClient: http.Client{
			Timeout: 10 * time.Second,
		},

		endpoint:  endpoint,
		authToken: authToken,
	}
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
	_, present := c.badASNs[asn]
	return present, asn, nil
}

func (c *Checker) Worker(ctx context.Context) {
	rateLimitTicker := time.NewTicker(500 * time.Millisecond)
	defer rateLimitTicker.Stop()
	for {
		select {
		case addressToCheck := <-c.checkQueue:
			addressAlreadyChecked := false
			func() {
				c.reputationLock.RLock()
				defer c.reputationLock.RUnlock()
				_, addressAlreadyChecked = c.reputation[addressToCheck]
			}()
			if addressAlreadyChecked {
				continue
			}
			<-rateLimitTicker.C // rate limit

			err := c.checkIPonAS207111(ctx, addressToCheck)
			if err != nil {
				c.log.Println("error checking IP info on AS207111:", stacktrace.Propagate(err, ""))
				badASN, asn, err := c.isBadASN(addressToCheck, 0)
				if err != nil {
					c.log.Println("error checking IP ASN:", stacktrace.Propagate(err, ""))
				} else if badASN {
					c.setAddressReputation(addressToCheck, 1.0)
					c.log.Printf("IP %v is from disallowed ASN %d", addressToCheck, asn)
				}
			}

		case <-ctx.Done():
			return
		}
	}
}

func (c *Checker) setAddressReputation(address string, reputation float32) {
	c.reputationLock.Lock()
	defer c.reputationLock.Unlock()
	c.reputation[address] = reputation
}

func (c *Checker) checkIPonAS207111(ctx context.Context, addressToCheck string) error {
	url := fmt.Sprintf(c.endpoint, addressToCheck)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	req.Header.Add("Authorization", "Bearer "+c.authToken)
	resp, err := c.httpClient.Do(req)
	if err != nil {
		c.setAddressReputation(addressToCheck, 0.5)
		return stacktrace.Propagate(err, "")
	}
	if resp.StatusCode != http.StatusOK {
		c.setAddressReputation(addressToCheck, 0.5)
		return stacktrace.NewError("non-200 status code when checking IP reputation for address %s", addressToCheck)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.log.Println("error reading response body:", stacktrace.Propagate(err, ""))
		c.setAddressReputation(addressToCheck, 0.5)
		return stacktrace.Propagate(err, "")
	}

	var response struct {
		ASN struct {
			ASN int `json:"asn"`
		} `json:"asn"`
		Privacy struct {
			Proxy   bool `json:"proxy"`
			Hosting bool `json:"hosting"`
		} `json:"privacy"`
	}

	err = json.Unmarshal(body, &response)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	isBadASN, _, err := c.isBadASN("", response.ASN.ASN)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	r := float32(0.0)
	if response.Privacy.Proxy || response.Privacy.Hosting {
		r = 1.0
		c.log.Printf("IP %v is bad actor", addressToCheck)
	} else if isBadASN {
		r = 1.0
		c.log.Printf("IP %v is from disallowed ASN %d", addressToCheck, response.ASN.ASN)
	} else {
		c.log.Printf("IP %v seems good", addressToCheck)
	}

	c.setAddressReputation(addressToCheck, r)
	return nil
}

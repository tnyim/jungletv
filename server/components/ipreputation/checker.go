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
			url := fmt.Sprintf(c.endpoint, addressToCheck)
			req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
			if err != nil {
				c.log.Println("error building http request:", stacktrace.Propagate(err, ""))
				continue
			}
			req.Header.Add("Authorization", "Bearer "+c.authToken)
			resp, err := c.httpClient.Do(req)
			if err != nil {
				c.log.Println("error checking IP reputation:", stacktrace.Propagate(err, ""))
				func() {
					c.reputationLock.Lock()
					defer c.reputationLock.Unlock()
					c.reputation[addressToCheck] = 0.5
				}()
				continue
			}
			if resp.StatusCode != http.StatusOK {
				c.log.Println("non-200 status code when checking IP reputation for address", addressToCheck)
				func() {
					c.reputationLock.Lock()
					defer c.reputationLock.Unlock()
					c.reputation[addressToCheck] = 0.5
				}()
				continue
			}
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				c.log.Println("error reading response body:", stacktrace.Propagate(err, ""))
				func() {
					c.reputationLock.Lock()
					defer c.reputationLock.Unlock()
					c.reputation[addressToCheck] = 0.5
				}()
				continue
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
				c.log.Println("error parsing response:", stacktrace.Propagate(err, ""))
				continue
			}

			r := float32(0.0)
			if response.Privacy.Proxy || response.Privacy.Hosting {
				r = 1.0
				c.log.Printf("IP %v is bad actor", addressToCheck)
			} else if _, present := c.badASNs[response.ASN.ASN]; present {
				r = 1.0
				c.log.Printf("IP %v is from disallowed ASN %d", addressToCheck, response.ASN.ASN)
			} else {
				c.log.Printf("IP %v seems good", addressToCheck)
			}
			func() {
				c.reputationLock.Lock()
				defer c.reputationLock.Unlock()
				c.reputation[addressToCheck] = r
			}()
		case <-ctx.Done():
			return
		}
	}

}

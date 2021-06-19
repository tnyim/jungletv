package server

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/palantir/stacktrace"
)

// IPAddressReputationChecker checks the reputation of IP addresses
type IPAddressReputationChecker struct {
	log            *log.Logger
	reputation     map[string]float32
	reputationLock sync.RWMutex

	checkQueue chan string
}

// NewIPAddressReputationChecker initializes and returns a new IPAddressReputationChecker
func NewIPAddressReputationChecker(log *log.Logger) *IPAddressReputationChecker {
	return &IPAddressReputationChecker{
		log:        log,
		reputation: make(map[string]float32),
		checkQueue: make(chan string, 1000),
	}
}

func (c *IPAddressReputationChecker) CanReceiveRewards(remoteAddress string) bool {
	c.reputationLock.RLock()
	defer c.reputationLock.RUnlock()
	badActorConfidence, present := c.reputation[remoteAddress]
	if !present {
		c.EnqueueAddressForChecking(remoteAddress)
		return true // let's be generous and reward until they're checked
	}
	return badActorConfidence < 0.95
}

func (c *IPAddressReputationChecker) EnqueueAddressForChecking(remoteAddress string) {
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

func (c *IPAddressReputationChecker) Worker(ctx context.Context) {
	httpClient := http.Client{
		Timeout: 10 * time.Second,
	}
	for {
		select {
		case addressToCheck := <-c.checkQueue:
			url := fmt.Sprintf("http://check.getipintel.net/check.php?ip=%s&contact=gabriel@tny.im", addressToCheck)
			req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
			if err != nil {
				c.log.Println("error building http request:", stacktrace.Propagate(err, ""))
				continue
			}
			resp, err := httpClient.Do(req)
			if err != nil {
				c.log.Println("error checking IP reputation:", stacktrace.Propagate(err, ""))
				continue
			}
			if resp.StatusCode != http.StatusOK {
				c.log.Println("non-200 status code when checking IP reputation for address", addressToCheck)
				continue
			}
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				c.log.Println("error reading response body:", stacktrace.Propagate(err, ""))
				continue
			}
			badActorConfidence, err := strconv.ParseFloat(string(body), 32)
			if err != nil {
				c.log.Println("error parsing confidence:", stacktrace.Propagate(err, ""))
				continue
			}

			if badActorConfidence >= 0 {
				func() {
					c.reputationLock.Lock()
					defer c.reputationLock.Unlock()
					c.reputation[addressToCheck] = float32(badActorConfidence)
				}()
				c.log.Printf("Bad Actor Confidence for IP %v is %v", addressToCheck, badActorConfidence)
			}
		case <-ctx.Done():
			return
		}
	}

}

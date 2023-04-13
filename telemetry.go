package main

import (
	"context"
	"fmt"
	"runtime/metrics"
	"strings"
	"time"

	"github.com/palantir/stacktrace"
	"gopkg.in/alexcesaro/statsd.v2"
)

func buildStatsClient() (*statsd.Client, error) {
	telemetryKeybox, present := secrets.GetBox("telemetry")
	if !present {
		c, err := statsd.New(statsd.Mute(true))
		if err != nil {
			return nil, stacktrace.Propagate(err, "")
		}
		return c, stacktrace.Propagate(err, "")
	}

	statsdAddress, present := telemetryKeybox.Get("statsdAddress")
	statsdPrefix, present2 := telemetryKeybox.Get("statsdPrefix")
	if !present || !present2 {
		return nil, stacktrace.NewError("statsd address/prefix not present in telemetry keybox")
	}

	c, err := statsd.New(statsd.Address(statsdAddress), statsd.Prefix(statsdPrefix))
	return c, stacktrace.Propagate(err, "")
}

// statsSender is meant to be called as a goroutine that handles sending telemetry
// to a statsd (or compatible) server
func statsSender(ctx context.Context, c *statsd.Client) {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	descs := metrics.All()
	samples := make([]metrics.Sample, len(descs))
	for i := range samples {
		samples[i].Name = descs[i].Name
	}

	var totalReadDuration time.Duration
	for {
		select {
		case <-ticker.C:
			readStart := time.Now()
			metrics.Read(samples)
			dbStats := rdb.Stats()
			totalReadDuration += time.Since(readStart)

			for _, sample := range samples {
				name, value := sample.Name, sample.Value
				name = strings.TrimLeft(name, "/")
				name = strings.ReplaceAll(name, "/", ".")
				name = strings.ReplaceAll(name, "-", "_")
				name = strings.ReplaceAll(name, ":", "_")
				name = fmt.Sprintf("profiling.runtime.%s", name)
				switch value.Kind() {
				case metrics.KindUint64:
					c.Gauge(name, value.Uint64())
				case metrics.KindFloat64:
					c.Gauge(name, value.Float64())
				}
			}

			c.Gauge("profiling.db.open_connections", dbStats.OpenConnections)
			c.Gauge("profiling.db.in_use", dbStats.InUse)
			c.Gauge("profiling.db.idle", dbStats.Idle)

			c.Gauge("profiling.metrics.collection.total_seconds", totalReadDuration.Seconds())
		case <-ctx.Done():
			return
		}
	}
}

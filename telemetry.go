package main

import (
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

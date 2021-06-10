package server

import (
	"context"
	"time"

	"github.com/bwmarrin/snowflake"
)

// ChatStore can save and load chat messages
type ChatStore interface {
	StoreMessage(context.Context, *ChatMessage) error
	DeleteMessage(context.Context, snowflake.ID) error
	LoadMessagesSince(context.Context, time.Time) ([]*ChatMessage, error)
	LoadNumLatestMessages(context.Context, int) ([]*ChatMessage, error)
}

// ChatStoreNoOp does not actually store any messages
type ChatStoreNoOp struct{}

func (*ChatStoreNoOp) StoreMessage(context.Context, *ChatMessage) error {
	return nil
}

func (*ChatStoreNoOp) DeleteMessage(context.Context, snowflake.ID) error {
	return nil
}

func (*ChatStoreNoOp) LoadMessagesSince(context.Context, time.Time) ([]*ChatMessage, error) {
	return []*ChatMessage{}, nil
}

func (*ChatStoreNoOp) LoadNumLatestMessages(context.Context, int) ([]*ChatMessage, error) {
	return []*ChatMessage{}, nil
}

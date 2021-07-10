package server

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/emirpasic/gods/maps/treemap"
	"github.com/emirpasic/gods/utils"
)

// ErrChatMessageNotFound is returned by a ChatStore when LoadMessage or DeleteMessage does not find the given message
var ErrChatMessageNotFound = errors.New("chat message not found")

// ChatStore can save and load chat messages
type ChatStore interface {
	StoreMessage(context.Context, *ChatMessage) error
	DeleteMessage(context.Context, snowflake.ID) (*ChatMessage, error)
	LoadMessagesSince(context.Context, User, time.Time) ([]*ChatMessage, error)
	LoadNumLatestMessages(context.Context, User, int) ([]*ChatMessage, error)
	LoadNumLatestMessagesFromUser(context.Context, User, int) ([]*ChatMessage, error)
	LoadMessage(context.Context, snowflake.ID) (*ChatMessage, error)
}

// ChatStoreNoOp does not actually store any messages
type ChatStoreNoOp struct{}

func (*ChatStoreNoOp) StoreMessage(context.Context, *ChatMessage) error {
	return nil
}

func (*ChatStoreNoOp) DeleteMessage(context.Context, snowflake.ID) (*ChatMessage, error) {
	return &ChatMessage{}, nil
}

func (*ChatStoreNoOp) LoadMessagesSince(context.Context, User, time.Time) ([]*ChatMessage, error) {
	return []*ChatMessage{}, nil
}

func (*ChatStoreNoOp) LoadNumLatestMessages(context.Context, User, int) ([]*ChatMessage, error) {
	return []*ChatMessage{}, nil
}

func (*ChatStoreNoOp) LoadNumLatestMessagesFromUser(context.Context, User, int) ([]*ChatMessage, error) {
	return []*ChatMessage{}, nil
}

func (*ChatStoreNoOp) LoadMessage(context.Context, snowflake.ID) (*ChatMessage, error) {
	return nil, nil
}

// ChatStoreMemory stores messages in memory
type ChatStoreMemory struct {
	l           sync.RWMutex
	msgMap      *treemap.Map
	maxMessages int
}

// NewChatStoreMemory initializes and returns a new ChatStoreMemory
func NewChatStoreMemory(maxMessages int) *ChatStoreMemory {
	return &ChatStoreMemory{
		msgMap:      treemap.NewWith(utils.Int64Comparator),
		maxMessages: maxMessages,
	}
}

func (s *ChatStoreMemory) StoreMessage(_ context.Context, m *ChatMessage) error {
	s.l.Lock()
	defer s.l.Unlock()
	s.msgMap.Put(m.ID.Int64(), m)
	for s.msgMap.Size() > s.maxMessages {
		k, _ := s.msgMap.Min()
		if k == nil {
			break
		}
		s.msgMap.Remove(k)
	}
	return nil
}

func (s *ChatStoreMemory) DeleteMessage(_ context.Context, id snowflake.ID) (*ChatMessage, error) {
	s.l.Lock()
	defer s.l.Unlock()
	if deletedMesage, present := s.msgMap.Get(id.Int64()); present {
		s.msgMap.Remove(id.Int64())
		it := s.msgMap.Iterator()
		for it.End(); it.Prev(); {
			m := it.Value().(*ChatMessage)
			if m.Reference != nil && m.Reference.ID == id {
				m.Reference = nil
			}
		}
		return deletedMesage.(*ChatMessage), nil
	} else {
		return nil, ErrChatMessageNotFound
	}
}

func (s *ChatStoreMemory) LoadMessagesSince(_ context.Context, includeShadowbanned User, since time.Time) ([]*ChatMessage, error) {
	s.l.RLock()
	defer s.l.RUnlock()

	messages := []*ChatMessage{}
	it := s.msgMap.Iterator()
	for it.End(); it.Prev(); {
		m := it.Value().(*ChatMessage)
		if m.CreatedAt.After(since) {
			if !m.Shadowbanned || (m.Author != nil && includeShadowbanned != nil && m.Author.Address() == includeShadowbanned.Address()) {
				messages = append(messages, m)
			}
		} else {
			// IDs are snowflakes and therefore sorted by time
			break
		}
	}
	for i, j := 0, len(messages)-1; i < j; i, j = i+1, j-1 {
		messages[i], messages[j] = messages[j], messages[i]
	}
	return messages, nil
}

func (s *ChatStoreMemory) LoadNumLatestMessages(_ context.Context, includeShadowbanned User, num int) ([]*ChatMessage, error) {
	s.l.RLock()
	defer s.l.RUnlock()

	messages := []*ChatMessage{}
	it := s.msgMap.Iterator()
	i := 0
	for it.End(); it.Prev() && i < num; {
		m := it.Value().(*ChatMessage)
		if !m.Shadowbanned || (m.Author != nil && includeShadowbanned != nil && m.Author.Address() == includeShadowbanned.Address()) {
			messages = append(messages, m)
			i++
		}
	}
	for i, j := 0, len(messages)-1; i < j; i, j = i+1, j-1 {
		messages[i], messages[j] = messages[j], messages[i]
	}
	return messages, nil
}

func (s *ChatStoreMemory) LoadNumLatestMessagesFromUser(_ context.Context, user User, num int) ([]*ChatMessage, error) {
	s.l.RLock()
	defer s.l.RUnlock()

	messages := []*ChatMessage{}
	it := s.msgMap.Iterator()
	i := 0
	for it.End(); it.Prev() && i < num; {
		m := it.Value().(*ChatMessage)
		if m.Author != nil && m.Author.Address() == user.Address() {
			messages = append(messages, m)
			i++
		}
	}
	for i, j := 0, len(messages)-1; i < j; i, j = i+1, j-1 {
		messages[i], messages[j] = messages[j], messages[i]
	}
	return messages, nil
}

func (s *ChatStoreMemory) LoadMessage(_ context.Context, id snowflake.ID) (*ChatMessage, error) {
	s.l.RLock()
	defer s.l.RUnlock()
	m, found := s.msgMap.Get(id.Int64())
	if !found {
		return nil, ErrChatMessageNotFound
	}
	return m.(*ChatMessage), nil
}

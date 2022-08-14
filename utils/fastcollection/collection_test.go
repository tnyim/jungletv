package fastcollection_test

import (
	"fmt"
	"math/rand"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"github.com/tnyim/jungletv/utils/fastcollection"
)

func TestCollection(t *testing.T) {
	c := fastcollection.FastCollection[string]{}

	entry1ID := c.Insert("A")
	entry2ID := c.Insert("B")
	entry3ID := c.Insert("C")

	entries := c.Entries()
	require.Len(t, entries, 3)
	require.Equal(t, 3, c.Len())
	require.Equal(t, 3, c.Cap())
	require.Contains(t, entries, "A")
	require.Contains(t, entries, "B")
	require.Contains(t, entries, "C")

	require.Equal(t, "B", c.Delete(entry2ID))

	entries = c.Entries()
	require.Len(t, entries, 2)
	require.Equal(t, 2, c.Len())
	require.Equal(t, 3, c.Cap())
	require.Contains(t, entries, "A")
	require.Contains(t, entries, "C")

	require.Equal(t, "A", c.Delete(entry1ID))

	entries = c.Entries()
	require.Len(t, entries, 1)
	require.Equal(t, 1, c.Len())
	require.Contains(t, entries, "C")

	entry4ID := c.Insert("D")

	entries = c.Entries()
	require.Len(t, entries, 2)
	require.Equal(t, 2, c.Len())
	require.Equal(t, 3, c.Cap())
	require.Contains(t, entries, "C")
	require.Contains(t, entries, "D")

	require.Equal(t, "C", c.Delete(entry3ID))
	require.Equal(t, "D", c.Delete(entry4ID))

	entries = c.Entries()
	require.Len(t, entries, 0)
	require.Equal(t, 0, c.Len())
	require.Equal(t, 3, c.Cap())
}

func TestCollectionWithReferenceType(t *testing.T) {
	c := fastcollection.FastCollection[chan string]{}

	entry1 := make(chan string)
	entry1ID := c.Insert(entry1)
	recovered := c.Delete(entry1ID)

	entry2 := make(chan string)
	c.Insert(entry2)

	require.Equal(t, entry1, recovered)

	c.ForEach(func(ch *chan string) {
		require.Equal(t, entry2, *ch)
		require.NotEqual(t, entry1, *ch)
	})
}

func TestLargeCollection(t *testing.T) {
	c := fastcollection.FastCollection[string]{}

	numEntries := 10000
	ids := make([]int, numEntries)
	for i := 0; i < numEntries; i++ {
		ids[i] = c.Insert(fmt.Sprint(i))
	}

	rand.Seed(time.Now().Unix())

	rand.Shuffle(numEntries, func(i, j int) {
		ids[i], ids[j] = ids[j], ids[i]
	})

	for i := 0; i < numEntries/2; i++ {
		c.Delete(ids[i])
	}

	require.Len(t, c.Entries(), numEntries/2)
	require.Equal(t, numEntries/2, c.Len())

	for i := 0; i < numEntries/2; i++ {
		ids[i] = c.Insert(fmt.Sprint(i))
	}

	require.Len(t, c.Entries(), numEntries)
	require.Equal(t, numEntries, c.Len())
	require.Equal(t, numEntries, c.Cap())

	for i := 0; i < numEntries; i++ {
		c.Delete(ids[i])
	}

	require.Empty(t, c.Entries())
	require.Equal(t, 0, c.Len())
	require.Equal(t, numEntries, c.Cap())
}

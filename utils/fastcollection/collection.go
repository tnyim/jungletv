package fastcollection

// FastCollection is an array-backed unordered collection with the goal of having fast insertions, fast deletions and fast iterations
// (without as much of a spatial locality penalty as iterations over a linked list would incur)
// FastCollection is not thread safe (analogous to Go's built-in slices and maps)
// Do not modify UnsafeBackingArray externally (modifying the Content of its entries is safe, modifying anything else is not)
// The zero value of FastCollection is usable without any special initialization
type FastCollection[T any] struct {
	lastDeleteIdx      int // offset from the indices of UnsafeBackingArray by +1, so we can use the zero value of this type as-is
	len                int
	UnsafeBackingArray []entry[T]
}

type entry[T any] struct {
	NextDeleteIdx int // offset in the same way as lastDeleteIdx
	Content       T
}

// Insert inserts the item in the collection and returns an identifier that should be used for its removal
func (c *FastCollection[T]) Insert(item T) int {
	c.len++
	if c.lastDeleteIdx > 0 {
		insertIdx := c.lastDeleteIdx - 1
		c.lastDeleteIdx = c.UnsafeBackingArray[insertIdx].NextDeleteIdx
		c.UnsafeBackingArray[insertIdx] = entry[T]{
			NextDeleteIdx: -1,
			Content:       item,
		}
		return insertIdx
	}
	insertIdx := len(c.UnsafeBackingArray)
	c.UnsafeBackingArray = append(c.UnsafeBackingArray, entry[T]{
		NextDeleteIdx: -1,
		Content:       item,
	})
	return insertIdx
}

// Delete deletes an item from the collection using the identifier that was returned when it was inserted
// Each item must be deleted only once
// Deleting items does not reduce the memory used by this FastCollection, whose capacity can only grow
func (c *FastCollection[T]) Delete(removeIdx int) T {
	if c.UnsafeBackingArray[removeIdx].NextDeleteIdx >= 0 {
		// since we reuse IDs returned by insert, this is not meant to be an exhaustive error callers can rely on
		// this is more of a warning that the code must be fixed because it is attempting to delete the same entries twice
		panic("delete of deleted entry")
	}
	orig := c.UnsafeBackingArray[removeIdx].Content

	c.UnsafeBackingArray[removeIdx] = entry[T]{
		NextDeleteIdx: c.lastDeleteIdx,
	}
	c.lastDeleteIdx = removeIdx + 1
	c.len--
	return orig
}

// Len returns the count of items in the collection
func (c *FastCollection[T]) Len() int {
	return c.len
}

// Cap returns the capacity of the collection
func (c *FastCollection[T]) Cap() int {
	return len(c.UnsafeBackingArray)
}

// Cap returns the capacity of the backing structure of the collection
func (c *FastCollection[T]) BackingCap() int {
	return cap(c.UnsafeBackingArray)
}

// Entries returns all valid entries as a slice. This is not the most performant way to iterate of the collection
func (c *FastCollection[T]) Entries() []T {
	entries := []T{}
	for i := range c.UnsafeBackingArray {
		if c.UnsafeBackingArray[i].NextDeleteIdx < 0 {
			entries = append(entries, c.UnsafeBackingArray[i].Content)
		}
	}
	return entries
}

// ForEach allows for iterating over all entries without copying
func (c *FastCollection[T]) ForEach(do func(*T)) {
	for i := range c.UnsafeBackingArray {
		if c.UnsafeBackingArray[i].NextDeleteIdx < 0 {
			do(&c.UnsafeBackingArray[i].Content)
		}
	}
}

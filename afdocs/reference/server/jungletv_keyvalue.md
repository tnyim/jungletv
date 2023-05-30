# `jungletv:keyvalue` module

The `jungletv:keyvalue` module provides access to a simple key-value storage that is private to the server component of the application and persists across application executions and across application versions.

The interface and behavior of this module is largely the same as that of the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Storage).

Both the key names and values are stored as strings; non-string names and values are converted to string, using the JavaScript rules for automatic string conversion. Applications can store and retrieve complex values by encoding and decoding them, e.g. using `JSON.stringify()` and `JSON.parse()`.

Key names are limited to a maximum length of 2048 bytes **as measured when the name is encoded using UTF-8**.
Values do not have an explicit length limit.
There is no explicit limit to the amount of keys an application can have in storage.

This module is not imported by default. To use this module, import it in your server scripts as follows:

```js
const keyvalue = require("jungletv:keyvalue")
```

## Methods

### `key()`

Returns the name of the storage key at the specified index.
Thanks to this method, it is possible to iterate over all the keys in storage even when their names are not known.

#### Syntax

```js
keyvalue.key(index)
```

##### Parameters

- `index` - An integer corresponding to the zero-based index of the key whose name is to be retrieved.

##### Return value

A string containing the name of the storage key at the specified index, or `null` if a key at that index does not exist.

### `getItem()`

Returns the value of the storage key with the specified name.

#### Syntax

```js
keyvalue.getItem(keyName)
```

##### Parameters

- `keyName` - A string corresponding to the name of the key to retrieve from storage. This string can be up to 2048 bytes long, **as measured when encoded using UTF-8**.

##### Return value

A string containing the value of the storage item with the specified name, or `null` if such a key does not exist.

##### Exceptions

- `TypeError` - Thrown if the first argument is longer than 2048 bytes, as measured when encoded using UTF-8.

### `setItem()`

Updates the value of the storage key with the specified name, creating a new key/value pair if necessary.

#### Syntax

```js
keyvalue.setItem(keyName, keyValue)
```

##### Parameters

- `keyName` - A string corresponding to the name of the key to create or update in storage. This string can be up to 2048 bytes long, **as measured when encoded using UTF-8**.
- `keyValue` - A string containing the value to save in storage under the given key name.

##### Return value

None.

##### Exceptions

- `TypeError` - Thrown if the first argument is longer than 2048 bytes, as measured when encoded using UTF-8.

### `removeItem()`

Deletes the key with the specified name from storage.
This method does nothing if a key with the specified name does not exist in storage.

#### Syntax

```js
keyvalue.removeItem(keyName)
```

##### Parameters

- `keyName` - A string corresponding to the name of the key to remove from storage.

##### Return value

None.

##### Exceptions

- `TypeError` - Thrown if the first argument is longer than 2048 bytes, as measured when encoded using UTF-8.

### `clear()`

Clears all the keys in storage, emptying it.

#### Syntax

```js
keyvalue.clear()
```

##### Parameters

None.

##### Return value

None.

## Properties

### `length`

This read-only integer property returns the number of items (keys) in storage.

#### Syntax

```js
keyvalue.length
```
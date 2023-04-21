# `node:process` module

The `node:process` module lets applications control and obtain information about their own execution instance and operating environment.

This module is imported by default under the name `process`.
It can be reimported under a different name using `require("node:process")`.

## Methods

### `abort()`

Terminates the application instance immediately.

#### Syntax

```js
process.abort()
```

##### Parameters

None.

##### Return value

None.

### `exit()`

Terminates the application instance immediately with the specified exit code, or otherwise with the current value of [`exitCode`](#exitcode).

#### Syntax

```js
process.exit()
process.exit(code)
```

##### Parameters

- `code` - optional integer indicating the code with which the application instance should terminate.
  A value of zero indicates success.
  If omitted, the current value of [`exitCode`](#exitcode) is used instead.

##### Return value

None.

## Properties

### `exitCode`

Writable integer property that determines the application instance exit code when the application instance is exited.
If a code is specified in the call to [`exit()`](#exit), this value is ignored.

#### Syntax

```js
process.exitCode = 0
```

### `platform`

Read-only string indicating the current platform.
Guaranteed to be `jungletv`.

```js
process.platform
```

### `title`

Read-only string indicating the ID of the currently running application.

```js
process.title
```

### `version`

Read-only number indicating the version of the runtime running the application.

```js
process.version
```

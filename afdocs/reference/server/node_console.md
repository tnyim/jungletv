# `node:console` module

The `node:console` module lets applications use their own server-side debug console in order to log debug messages, warnings and errors.

This module is imported by default under the name `console`.
It can be reimported under a different name using `require("node:console")`.

## Methods

### `log()`

Outputs a message to the application console.

This is a synchronous method that is intended as a debugging tool; some input values can cause this method to block the event loop for a noticeable period.
Avoid using this method in a hot code path, especially if making use of complex formatting options or when passing parameters whose string representations are computationally intensive to obtain.

#### Syntax

```js
console.log(message)
console.log(arg1, /* ..., */ argN)
console.log(format, substitution1, /* ..., */ substitutionN)
```

##### Parameters

This method accepts an indefinite number of parameters.
Parameters may be a format string followed by an indefinite number of substitutions, or an indefinite number of any objects.
For details on the format options available and the resulting string depending on the number and type of parameters, see the [Node.js documentation for `util.format()`](https://nodejs.org/api/util.html#utilformatformat-args).
Note that not all format specifiers and their features may be supported by the JungleTV AF.

##### Return value

None.

### `warn()`

Outputs a warning message to the application console.
Warning messages are shown in the debug console with a yellow background next to a ⚠️ warning symbol.

This is a synchronous method that is intended as a debugging tool; some input values can cause this method to block the event loop for a noticeable period.
Avoid using this method in a hot code path, especially if making use of complex formatting options or when passing parameters whose string representations are computationally intensive to obtain.

#### Syntax

```js
console.warn(message)
console.warn(arg1, /* ..., */ argN)
console.warn(format, substitution1, /* ..., */ substitutionN)
```

##### Parameters

This method accepts the same parameters as [log()](#log).

##### Return value

None.

### `error()`

Outputs an error message to the application console.
Error messages are shown in the debug console with a red background next to a ❗ exclamation symbol.

This is a synchronous method that is intended as a debugging tool; some input values can cause this method to block the event loop for a noticeable period.
Avoid using this method in a hot code path, especially if making use of complex formatting options or when passing parameters whose string representations are computationally intensive to obtain.

#### Syntax

```js
console.error(message)
console.error(arg1, /* ..., */ argN)
console.error(format, substitution1, /* ..., */ substitutionN)
```

##### Parameters

This method accepts the same parameters as [log()](#log).
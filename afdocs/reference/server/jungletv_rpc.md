# `jungletv:rpc` module

The `jungletv:rpc` module allows for communication between the client-side pages, configured using the [`jungletv:pages`](./jungletv_pages.md) module, and the server-side application logic.

RPC stands for [Remote procedure call](https://en.wikipedia.org/wiki/Remote_procedure_call).

Keep in mind this page documents just the module that is available to the server scripts.
It should be used to define how to handle method calls and events originating from the client-side pages.

This module is not imported by default. To use this module, import it in your server scripts as follows:

```js
const rpc = require("jungletv:rpc")
```

## Methods

### `registerMethod()`

Sets the function that is called when the remote method with the given name is called by the client, and which can optionally return a value back to the client.

A minimum required permission level can be set for the method to be handled.

If a method handler had been previously defined for the provided method name, the handler will be replaced with the newly provided one.
Similarly, the required permission level will be updated to the newly provided one.

#### Syntax

```js
rpc.registerMethod(methodName, requiredPermissionLevel, handler)
```

##### Parameters

- `methodName` - A case-sensitive string identifying the method.
- `requiredPermissionLevel` - A string indicating the minimum permission level a user must have to be able to call this method.
  If the user doesn't have sufficient permissions to call the method, the client script throws an exception and the server script is never informed about the call.
  If you require more nuanced permission checks on this method, you should set this to the minimum permission level and perform the checks within the handler logic.
  See below for a table of accepted permission levels.
- `handler` - A function that will be executed whenever this remote method is called by a client with sufficient permissions.
  The function will be called with at least one argument, a [context object](#context-object), followed by any arguments included by the client in the invocation.
  The return value of the function will be serialized using JSON and sent back to the client.

| `requiredPermissionLevel` string      | Meaning                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| The empty string or `unauthenticated` | The method can be called by any user, even unauthenticated ones.                            |
| `user`                                | The method can only be called by authenticated users (users registered to receive rewards). |
| `admin`                               | The method can only be called by JungleTV staff.                                            |

##### Return value

None.

### `unregisterMethod()`

Unregisters a remote method with the given name, that had been previously registered using [registerMethod()](#registerMethod).
Until the method is registered again, an exception will be thrown on any clients that attempt to call it.

#### Syntax

```js
rpc.unregisterMethod(methodName)
```

##### Parameters

- `methodName` - A case-sensitive string identifying the method.
  This string must match the one passed to [registerMethod()](#registerMethod).
  If a method with this name is not registered, this function has no effect.

##### Return value

None.

### `addEventListener()`

Registers a function to be called whenever the remote event with the specified name is emitted by a client.
Unlike with methods, more than one listener may be registered to be called for each event type.
Clients can pass arguments when they trigger an event, but it is not possible for the server to return values to the client, and the client is notified of event delivery before server listeners for the event finish running, or even if they throw an exception.


#### Syntax

```js
rpc.addEventListener(eventName, listener)
```

##### Parameters

- `eventName` - A case-sensitive string identifying the event type.
  In addition to application-defined events, there is a set of runtime-emitted [events](#events).
- `listener` - A function that will be executed whenever this type of remote event is emitted by a client.
  The function will be called with at least one argument, a [context object](#context-object), followed by any arguments included by the client when emitting the event.

##### Return value

None.

### `removeEventListener()`

Ceases calling a function previously registered with [`addEventListener()`](#addeventlistener) whenever an event of the specified type is emitted by a client.

#### Syntax

```js
rpc.removeEventListener(eventName, listener)
```

##### Parameters

- `eventName` - A case-sensitive string identifying the event type.
- `listener` - The function previously passed to [`addEventListener()`](#addeventlistener), that should no longer be called whenever an event of the specified type occurs.

##### Return value

None.

### `emitToAll()`

Emits an event to all currently connected clients on any application page belonging to this application.

This method does not wait for event delivery before returning.
Using this method alone, it is not possible to know which, if any, clients received the event.

#### Syntax

```js
rpc.emitToAll(eventName)
rpc.emitToAll(eventName, arg1, /* ..., */ argN)
```

##### Parameters

- `eventName` - A case-sensitive string identifying the event type.
- This function accepts an indefinite number of additional parameters of arbitrary types, that will be serialized using JSON and transmitted to the clients.

##### Return value

None.

### `emitToPage()`

Emits an event to all currently connected clients on the specified application page.

This method does not wait for event delivery before returning.
Using this method alone, it is not possible to know which, if any, clients received the event.

#### Syntax

```js
rpc.emitToPage(pageID, eventName)
rpc.emitToPage(pageID, eventName, arg1, /* ..., */ argN)
```

##### Parameters

- `pageID` - A case-sensitive string representing the ID of the page to target.
  This must match the ID passed to [publishFile()](./jungletv_pages.md#publishfile).
- `eventName` - A case-sensitive string identifying the event type.
- This function accepts an indefinite number of additional parameters of arbitrary types, that will be serialized using JSON and transmitted to the targeted clients.

##### Return value

None.

### `emitToUser()`

Emits an event to all currently connected clients authenticated as the specified user.

This method does not wait for event delivery before returning.
Using this method alone, it is not possible to know which, if any, clients received the event.

#### Syntax

```js
rpc.emitToUser(user, eventName)
rpc.emitToUser(user, eventName, arg1, /* ..., */ argN)
```

##### Parameters

- `user` - A string representing the reward address of the user to target.
  Pass the empty string, or null or undefined, to target exclusively unauthenticated users.
- `eventName` - A case-sensitive string identifying the event type.
- This function accepts an indefinite number of additional parameters of arbitrary types, that will be serialized using JSON and transmitted to the targeted clients.

##### Return value

None.

### `emitToPageUser()`

Emits an event to all currently connected clients on the specified application page that are also authenticated as the specified user.

This method does not wait for event delivery before returning.
Using this method alone, it is not possible to know which, if any, clients received the event.

#### Syntax

```js
rpc.emitToPageUser(pageID, user, eventName)
rpc.emitToPageUser(pageID, user, eventName, arg1, /* ..., */ argN)
```

##### Parameters

- `pageID` - A case-sensitive string representing the ID of the page to target.
  This must match the ID passed to [publishFile()](./jungletv_pages.md#publishfile).
- `user` - A string representing the reward address of the user to target.
  Pass the empty string, or null or undefined, to target exclusively unauthenticated users.
- `eventName` - A case-sensitive string identifying the event type.
- This function accepts an indefinite number of additional parameters of arbitrary types, that will be serialized using JSON and transmitted to the targeted clients.

##### Return value

None.

## Events

In addition to application-defined events emitted by the clients, server scripts receive events emitted by the JungleTV AF runtime itself.
Applications can distinguish between events emitted by the runtime and events with the same name emitted by clients,
using the `trusted` field of the [context object](#context-object) passed as the first argument to event listeners.
Listen to these events using [`addEventListener()`](#addeventlistener).

### `connected`

This event is emitted when the connection between an application page and the server is established, typically when a visitor enters an application page.

#### Syntax

```js
rpc.addEventListener("connected", (context) => {
    if (!context.trusted) {
        return; // not a legitimate runtime-emitted event
    }
    context.sender.address // address of the user that connected
})
```

#### Event arguments

This event has no arguments beyond the [context](#context-object).

### `disconnected`

This event is emitted when an application page disconnects from the server, typically when a visitor leaves it.

#### Syntax

```js
rpc.addEventListener("disconnected", (context) => {
    if (!context.trusted) {
        return; // not a legitimate runtime-emitted event
    }
    context.sender.address // address of the user that disconnected
})
```

#### Event arguments

This event has no arguments beyond the [context](#context-object).

## Associated types

### Context object

Represents the context of a remote method invocation or remote event reception.

| Field     | Type                      | Description                                                                                                                                 |
| --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`    | string                    | ID of the page from where this event or method invocation originates, as passed to [publishFile()](./jungletv_pages.md#publishfile).        |
| `sender`  | [Sender](#sender-object)? | The authenticated user originating this event or invocation, will be undefined if the operation originates from an unauthenticated visitor. |
| `trusted` | boolean                   | Set to true on events emitted by the JungleTV AF itself. Guaranteed to be `false` on method invocations.                                    |

### Sender object

Represents the authenticated sender of a remote event or remote method invocation.

| Field             | Type   | Description                                                                        |
| ----------------- | ------ | ---------------------------------------------------------------------------------- |
| `address`         | string | Reward address of the user.                                                        |
| `nickname`        | string | Nickname of the user, may be empty if the user does not have a nickname set.       |
| `permissionLevel` | string | Either `admin` or `user` depending on whether the user is a JungleTV staff member. |
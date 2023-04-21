# `jungletv:chat` module

The `jungletv:chat` module allows for interaction with the JungleTV chat subsystem.

This module is not imported by default. To use this module, import it in your server scripts as follows:

```js
let chat = require("jungletv:chat")
```

## Methods

### `addEventListener()`

Registers a function to be called whenever the specified [event](#events) occurs.
Depending on the event, the function may be invoked with arguments containing information about the event.
Refer to the documentation about each [event type](#events) for details.

#### Syntax

```js
chat.addEventListener(type, listener)
```

##### Parameters

- `type` - A case-sensitive string representing the [event type](#events) to listen for.
- `listener` - A function that will be called when an event of the specified type occurs.

##### Return value

None.

### `removeEventListener()`

Ceases calling a function previously registered with [`addEventListener()`](#addeventlistener) whenever the specified [event](#events) occurs.

#### Syntax

```js
chat.removeEventListener(type, listener)
```

##### Parameters

- `type` - A case-sensitive string corresponding to the [event type](#events) from which to unsubscribe.
- `listener` - The function previously passed to [`addEventListener()`](#addeventlistener), that should no longer be called whenever an event of the given `type` occurs.

##### Return value

None.

### `createSystemMessage()`

Creates a new chat message with the appearance of a system message (centered content within a rectangle, without an identified author), that is immediately sent to all connected chat clients and registered in the chat message history.

#### Syntax

```js
chat.createSystemMessage(content)
```

##### Parameters

- `content` - The content of the message.
  The content will be parsed as [GitHub Flavored Markdown](https://github.github.com/gfm/) by the JungleTV clients.
  Consider escaping any characters that may unintentionally constitute Markdown formatting.
  System message contents do not have an explicit length limit.

##### Return value

A [message object](#message-object) representing the created chat message.

### `getMessages()`

Retrieves chat messages created between two dates.

#### Syntax

```js
chat.getMessages(since, until)
```

##### Parameters

- `since` - A Date representing the start of the time range for which to retrieve chat messages.
- `until` - A Date representing the end of the time range for which to retrieve chat messages.

##### Return value

An array of [message objects](#message-object) sent in the specified time range.
Shadowbanned messages are not included.

## Properties

### `enabled`

This writable property indicates whether the chat is enabled.
When the chat is disabled, users are not able to send messages.
Users may still be able to see recent chat history up to the point when the chat was disabled.
System messages can still be created (e.g. using [`createSystemMessage()`](#createsystemmessage)) and may be visible to users subscribed to the chat, but this behavior is not guaranteed.
When the chat is disabled, applications are still able to fetch chat message history using [`getMessages()`](#getmessages).

#### Syntax

```js
chat.enabled = true
chat.enabled = false
```

### `slowMode`

This writable property indicates whether the chat is in slow mode.
When the chat is in slow mode, most users are limited to sending one message every 20 seconds.
Slow mode does not affect chat moderators nor the creation of system messages.

#### Syntax

```js
chat.slowMode = true
chat.slowMode = false
```

## Events

Listen to these events using [`addEventListener()`](#addeventlistener).

### `chatenabled`

This event is fired when the chat is enabled after having been disabled.

#### Syntax

```js
chat.addEventListener("chatenabled", (event) => {})
```

#### Event properties

| Field  | Type   | Description                     |
| ------ | ------ | ------------------------------- |
| `type` | string | Guaranteed to be `chatenabled`. |

### `chatdisabled`

This event is fired when the chat is disabled after having been enabled.

#### Syntax

```js
chat.addEventListener("chatdisabled", (event) => {})
```

#### Event properties

| Field    | Type   | Description                                                          |
| -------- | ------ | -------------------------------------------------------------------- |
| `type`   | string | Guaranteed to be `chatdisabled`.                                     |
| `reason` | number | Unused field. The type and presence of this field is not guaranteed. |


### `messagecreated`

This event is fired when a new chat message is sent to chat, even if that message is shadowbanned.

#### Syntax

```js
chat.addEventListener("messagecreated", (event) => {})
```

#### Event properties

| Field     | Type                       | Description                        |
| --------- | -------------------------- | ---------------------------------- |
| `type`    | string                     | Guaranteed to be `messagecreated`. |
| `message` | [Message](#message-object) | The created message.               |

### `messagedeleted`

This event is fired when a chat message is deleted.

#### Syntax

```js
chat.addEventListener("messagedeleted", (event) => {})
```

#### Event properties

| Field       | Type   | Description                        |
| ----------- | ------ | ---------------------------------- |
| `type`      | string | Guaranteed to be `messagedeleted`. |
| `messageID` | string | The ID of the deleted message.     |

## Associated types

### Message object

Represents a message sent in the JungleTV chat.

| Field          | Type                                       | Description                                                                                                                                                                                                                                                                           |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`           | string                                     | The unique ID of the chat message.                                                                                                                                                                                                                                                    |
| `createdAt`    | Date                                       | When the message was created.                                                                                                                                                                                                                                                         |
| `content`      | string                                     | The contents of the message.                                                                                                                                                                                                                                                          |
| `shadowbanned` | boolean                                    | Whether this message is shadowbanned, i.e. whether it should only be shown to its author.                                                                                                                                                                                             |
| `author`       | [Author](#author-object)?                  | The author of the message, only present if the message has an author. Messages without an author are considered system messages.                                                                                                                                                      |
| `reference`    | [Message](#message-object)?                | A partial representation of the message to which this message is a reply. Not present if the message is not a reply to another message. The partial representation is guaranteed to include the message `id`, `content` and `author` and guaranteed **not** to include a `reference`. |
| `attachments`  | array of [Attachment](#attachment-object)s | The list of message attachments.                                                                                                                                                                                                                                                      |

### Author object

Represents the author of a chat [message](#message-object).

| Field              | Type    | Description                                                                                                                                                 |
| ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `address`          | string  | Reward address of the message author.                                                                                                                       |
| `isFromAlienChain` | boolean | Whether the `address` is from a currency system that is not the one native to JungleTV. Currently guaranteed to be false in the context of the chat system. |
| `nickname`         | string  | Nickname of the message author, may be empty if the user does not have a nickname set.                                                                      |

### Attachment object

Represents an attachment of a chat [message](#message-object).
Each type of attachment has its own interface.

| Field  | Type   | Description             |
| ------ | ------ | ----------------------- |
| `type` | string | The type of attachment. |

#### `tenorgif` attachment object

Corresponds to an attached [Tenor](https://tenor.com) GIF.
Note that despite the "GIF" name, these are typically served as web-compatible video.

| Field              | Type   | Description                                                                                 |
| ------------------ | ------ | ------------------------------------------------------------------------------------------- |
| `type`             | string | Guaranteed to be `tenorgif` for this type of attachment.                                    |
| `id`               | string | The Tenor GIF ID.                                                                           |
| `videoURL`         | string | The URL of the video for the GIF.                                                           |
| `videoFallbackURL` | string | The URL of an alternative video for the GIF, using a suboptimal but more compatible format. |
| `title`            | string | The title of the Tenor GIF.                                                                 |
| `width`            | number | The width of the GIF in pixels.                                                             |
| `height`           | number | The height of the GIF in pixels.                                                            |
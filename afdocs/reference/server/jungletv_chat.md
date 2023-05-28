# `jungletv:chat` module

The `jungletv:chat` module allows for interaction with the JungleTV chat subsystem.

This module is not imported by default. To use this module, import it in your server scripts as follows:

```js
const chat = require("jungletv:chat")
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

### `createMessage()`

Creates a new chat message, that is immediately sent to all connected chat clients and registered in the chat message history.
The message will appear as having been sent by the application, with the [nickname](#nickname) that is currently set.
Optionally, the message may reference another non-system message to which it is a reply.

#### Syntax

```js
chat.createMessage(content)
chat.createMessage(content, referenceID)
```

##### Parameters

- `content` - A string containing the content of the message.
  It must not be empty or consist of only whitespace characters.
  The content will be parsed as a restricted subset of [GitHub Flavored Markdown](https://github.github.com/gfm/) by the JungleTV clients.
  Consider escaping any characters that may unintentionally constitute Markdown formatting.
  Message contents are subject to some of the validation rules of chat messages sent by users, but do not have an explicit length limit.
- `referenceID` - An optional string containing the ID of another message to which this one is a reply.
  The message must not be a system message.
  This message reference may be removed from the message at a later point, if the referenced message is deleted.

##### Return value

A [message object](#message-object) representing the created chat message.

### `createMessageWithPageAttachment()`

Similar to [createMessage()](#createmessage), creates a new chat message including an application page as an attachment.
The message will appear as having been sent by the application, with the [nickname](#nickname) that is currently set.
The specified page must correspond to a page published by the caller application.
Optionally, the message may reference another non-system message to which it is a reply.

#### Syntax

```js
chat.createMessageWithPageAttachment(content, pageID, height)
chat.createMessageWithPageAttachment(content, pageID, height, referenceID)
```

##### Parameters

- `content` - A string containing the content of the message.
  Unlike with [createMessage()](#createmessage), **the content may be empty**.
  The content will be parsed as a restricted subset of [GitHub Flavored Markdown](https://github.github.com/gfm/) by the JungleTV clients.
  Consider escaping any characters that may unintentionally constitute Markdown formatting.
  Message contents are subject to some of the validation rules of chat messages sent by users, but do not have an explicit length limit.
- `pageID` - The ID of the application page to attach, as specified when publishing the page using e.g. [publishFile()](jungletv_pages#publishfile).
  The attached application page will be displayed below the content.
- `height` - The non-zero height of the application page in pixels as it will be displayed in the chat history.
  The maximum height is 512 pixels.
- `referenceID` - An optional string containing the ID of another message to which this one is a reply.
  The message must not be a system message.
  This message reference may be removed from the message at a later point, if the referenced message is deleted.

##### Return value

A [message object](#message-object) representing the created chat message.

### `createSystemMessage()`

Creates a new chat message with the appearance of a system message (centered content within a rectangle, without an identified author), that is immediately sent to all connected chat clients and registered in the chat message history.

#### Syntax

```js
chat.createSystemMessage(content)
```

##### Parameters

- `content` - A string containing the content of the message.
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

### `nickname`

This writable property corresponds to the nickname set for this application, visible in chat messages sent by the application.
When set to `null`, `undefined` or the empty string, the application will appear in chat using its ID.
The nickname is subject to similar restrictions as nicknames set by users.

#### Syntax

```js
chat.nickname = "My application"
chat.nickname = null
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
| `applicationID`    | string  | Application ID responsible for this user, may be empty if this user is not controlled by an application.                                                    |
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

#### `apppage` attachment object

Corresponds to an attached application page, e.g. as attached using [createMessageWithPageAttachment()](#createmessagewithpageattachment) by this or other application.

| Field                | Type   | Description                                                                                |
| -------------------- | ------ | ------------------------------------------------------------------------------------------ |
| `type`               | string | Guaranteed to be `apppage` for this type of attachment.                                    |
| `applicationID`      | string | The ID of the application the attached page belongs to.                                    |
| `applicationVersion` | string | The version of the application the attached page belongs to.                               |
| `pageID`             | string | The ID of the page.                                                                        |
| `pageTitle`          | string | The default title of the application page.                                                 |
| `height`             | number | The height of the application page in pixels as it would be displayed in the chat history. |
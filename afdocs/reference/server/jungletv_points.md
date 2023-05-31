# `jungletv:points` module

The `jungletv:points` module allows for interaction with the JungleTV points subsystem.

This module is not imported by default. To use this module, import it in your server scripts as follows:

```js
const points = require("jungletv:points")
```

## Methods

### `addEventListener()`

Registers a function to be called whenever the specified [event](#events) occurs.
Depending on the event, the function may be invoked with arguments containing information about the event.
Refer to the documentation about each [event type](#events) for details.

#### Syntax

```js
points.addEventListener(type, listener)
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
points.removeEventListener(type, listener)
```

##### Parameters

- `type` - A case-sensitive string corresponding to the [event type](#events) from which to unsubscribe.
- `listener` - The function previously passed to [`addEventListener()`](#addeventlistener), that should no longer be called whenever an event of the given `type` occurs.

##### Return value

None.

### `createTransaction()`

Adjusts a user's point balance by creating a new points transaction.

#### Syntax
```js
points.createTransaction(address, description, amount)
```

#### Parameters
- `address` - Reward address of the account to add/remove points from.
- `description` - The user-visible description for the transaction.
- `points` - A non-zero integer corresponding to the amount to adjust the balance by.

##### Return value

The created [points transaction](#transaction-object).

##### Exceptions

- `TypeError` - Thrown if the user has insufficient points to cover this transaction, when `points` is negative.

### `getBalance()`

Returns the current points balance of a user.

#### Syntax
```js
points.getBalance(address)
```

#### Parameters
- `address` - The reward address of the account for which to get the balance.

##### Return value

A non-negative integer representing the available points balance of the user.

## Events

### `transactioncreated`

This event is fired when a completely new points transaction is created.

#### Syntax
```js
points.addEventListener("transactioncreated", (event) => {})
```

#### Event properties

| Field         | Type                               | Description                            |
| ------------- | ---------------------------------- | -------------------------------------- |
| `type`        | string                             | Guaranteed to be `transactioncreated`. |
| `transaction` | [Transaction](#transaction-object) | The created points transaction.        |

### `transactionupdated`

This event is fired when an existing points transaction has its value updated.
This can only happen for specific transaction types, for which consecutive transactions of the same type are essentially collapsed as a single transaction.
The updated transaction retains its creation date but its update date and its value changes.

#### Syntax
```js
points.addEventListener("transactionupdated", (transaction) => {})
```

#### Event properties

| Field              | Type                               | Description                                           |
| ------------------ | ---------------------------------- | ----------------------------------------------------- |
| `type`             | string                             | Guaranteed to be `transactioncreated`.                |
| `transaction`      | [Transaction](#transaction-object) | The updated points transaction.                       |
| `pointsAdjustment` | number                             | The amount of points the transaction was adjusted by. |

## Associated types

### Transaction object

Represents a points transaction.

| Field             | Type                                  | Description                                                                                |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| `id`              | string                                | The unique ID of the transaction.                                                          |
| `address`         | string                                | The reward address of the user affected by this transaction.                               |
| `createdAt`       | Date                                  | When the transaction was created.                                                          |
| `updatedAt`       | Date                                  | When the transaction was last updated.                                                     |
| `value`           | number                                | The points value of the transaction.                                                       |
| `transactionType` | [Transaction type](#transaction-type) | The type of the transaction.                                                               |
| `extra`           | [Extra](#extra-object)                | Extra transaction properties. Varies based on transaction type and may be an empty object. |

### Transaction type string

Transaction types are represented by the following strings:

| Transaction Type String          | Description                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `activity_challenge_reward`      | Points received for completing an activity challenge.                                                        |
| `chat_activity_reward`           | Points received for participating in chat.                                                                   |
| `media_enqueued_reward`          | Points received for enqueuing media.                                                                         |
| `chat_gif_attachment`            | Points spent to attach a GIF to a chat message.                                                              |
| `manual_adjustment`              | Points balance manually adjusted (increased or decreased) by a JungleTV staff member.                        |
| `media_enqueued_reward_reversal` | Points deducted to undo the points reward received by enqueuing media, when media is removed from the queue. |
| `conversion_from_banano`         | Points received by converting from Banano.                                                                   |
| `queue_entry_reordering`         | Points spent to reorder queue entries.                                                                       |
| `monthly_subscription`           | Points spent to subscribe to JungleTV Nice.                                                                  |
| `skip_threshold_reduction`       | Points spent to reduce the Crowdfunded Skip threshold.                                                       |
| `skip_threshold_increase`        | Points spent to increase the Crowdfunded Skip threshold.                                                     |
| `concealed_entry_enqueuing`      | Points spent while enqueuing to hide media information while it is in the queue.                             |
| `application_defined`            | Points balance adjusted (increased or decreased) by a JAF application.                                       |

### Extra object

This dictionary holds arbitrary metadata for the transaction and additional fields may be present.
It differs based on the type of the transaction.

#### Extra object for the transaction type `media_enqueued_reward`

| Field   | Type   | Description                   |
| ------- | ------ | ----------------------------- |
| `media` | string | The ID of the enqueued media. |

#### Extra object for the transaction type `manual_adjustment`

| Field         | Type   | Description                                                        |
| ------------- | ------ | ------------------------------------------------------------------ |
| `reason`      | string | The user-provided reason for the change.                           |
| `adjusted_by` | string | The reward address of the staff member  that performed the change. |

#### Extra object for the transaction type `media_enqueued_reward_reversal`

| Field   | Type   | Description                                           |
| ------- | ------ | ----------------------------------------------------- |
| `media` | string | The ID of the media which was removed from the queue. |

#### Extra object for the transaction type `conversion_from_banano`

| Field     | Type   | Description                                       |
| --------- | ------ | ------------------------------------------------- |
| `tx_hash` | string | The hash of the state block that sent the banano. |

#### Extra object for the transaction type `queue_entry_reordering`

| Field       | Type               | Description                                                 |
| ----------- | ------------------ | ----------------------------------------------------------- |
| `media`     | string             | The ID of the media entry that was moved in the queue.      |
| `direction` | `"up"` or `"down"` | A string indicating whether the entry was moved up or down. |

#### Extra object for the transaction type `concealed_entry_enqueuing`

| Field   | Type   | Description                   |
| ------- | ------ | ----------------------------- |
| `media` | string | The ID of the enqueued media. |

#### Extra object for the transaction type `application_defined`

| Field                 | Type   | Description                                                          |
| --------------------- | ------ | -------------------------------------------------------------------- |
| `application_id`      | string | The application that created the transaction.                        |
| `application_version` | string | The version of the application.                                      |
| `description`         | string | The user-visible transaction description, as set by the application. |

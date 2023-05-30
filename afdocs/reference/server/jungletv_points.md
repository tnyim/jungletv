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
points.createTransaction(address, reason, amount)
```

#### Parameters
- `address` - Reward address of the account to add/remove points from.
- `description` - The user-visible description for the transaction.
- `points` - A non-zero integer corresponding to the amount to adjust the balance by.

##### Return value

The created [points transaction](#points-transaction).

##### Exceptions

- `TypeError` - Thrown if the user has insufficient points to cover this transaction, when `points` is negative.

### `getBalance()`

Returns the current point balance of a user

#### Syntax
```js
points.getBalance(address)
```

#### Parameters
- `address` - The reward address of the account for which to get the balance.

##### Return value

An integer representing the available points balance of the user.

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

| Field             | Type                               | Description                                           |
| ----------------- | ---------------------------------- | ----------------------------------------------------- |
| `type`            | string                             | Guaranteed to be `transactioncreated`.                |
| `transaction`     | [Transaction](#transaction-object) | The created points transaction.                       |
| `adjustmentValue` | number                             | The amount of points the transaction was adjusted by. |

## Associated types

### Transaction object

Represents a points transaction.

| Field             | Type                   | Description                                                                                |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `id`              | string                 | The unique ID of the transaction.                                                          |
| `address`         | string                 | The reward address of the user affected by this transaction.                               |
| `createdAt`       | Date                   | When the transaction was created created.                                                  |
| `updatedAt`       | Date                   | When the transaction was last updated created.                                             |
| `value`           | number                 | The points value of the transaction.                                                       |
| `transactionType` | number                 | The type of the transaction. **Note:** the type of this field is subject to change.        |
| `extra`           | [Extra](#extra-object) | Extra transaction properties. Varies based on transaction type and may be an empty object. |


### Extra object

This dictionary holds arbitrary metadata for the transaction and additional fields may be present.
It differs based on the type of the transaction.

#### Transaction Type 3 `media_enqueued_reward` extra object

| Field   | Type   | Description                   |
| ------- | ------ | ----------------------------- |
| `media` | string | The ID of the enqueued media. |

#### Transaction Type 5 `manual_adjustment` extra object

| Field         | Type   | Description                                                        |
| ------------- | ------ | ------------------------------------------------------------------ |
| `reason`      | string | The user-provided reason for the change.                           |
| `adjusted_by` | string | The reward address of the staff member  that performed the change. |

#### Transaction Type 6 `media_enqueued_reward_reversal` extra object

| Field   | Type   | Description                                           |
| ------- | ------ | ----------------------------------------------------- |
| `media` | string | The ID of the media which was removed from the queue. |

#### Transaction Type 7 `conversion_from_banano` extra object

| Field     | Type   | Description                                       |
| --------- | ------ | ------------------------------------------------- |
| `tx_hash` | string | The hash of the state block that sent the banano. |

#### Transaction Type 8 `queue_entry_reordering` extra object

| Field       | Type               | Description                                                 |
| ----------- | ------------------ | ----------------------------------------------------------- |
| `media`     | string             | The ID of the media entry that was moved in the queue.      |
| `direction` | `"up"` or `"down"` | A string indicating whether the entry was moved up or down. |

#### Transaction Type 12 `concealed_entry_enqueuing` extra object

| Field   | Type   | Description                   |
| ------- | ------ | ----------------------------- |
| `media` | string | The ID of the enqueued media. |

#### Transaction Type 13 `application_defined` extra object

| Field                 | Type   | Description                                                          |
| --------------------- | ------ | -------------------------------------------------------------------- |
| `application_id`      | string | The application that created the transaction.                        |
| `application_version` | string | The version of the application.                                      |
| `description`         | string | The user-visible transaction description, as set by the application. |

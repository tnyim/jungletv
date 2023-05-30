# `jungletv:points` module

## Methods

### `createTransaction()`

Adjusts a user's point balance.

#### Syntax
```js
chat.createTransaction(address, reason, amount)
```

#### Parameters
- `address` The account to add/remove points from.
- `description` The description for the transaction.
- `points` The amount to adjust by. May be negative to remove points.

### `getBalance()`

Returns the current point balance of a user

#### Syntax
```js
chat.getBalance(address, reason, amount)
```

#### Parameters
- `address` The account to query.

##### Return value
The available points balance for the user.

## Events

### `transactioncreated`

#### Syntax
```js
points.addEventListener("transactioncreated", (transaction) => {})
```

- `transaction` The [points transaction](#points-transaction)

### `transactionupdated`

#### Syntax
```js
points.addEventListener("transactionupdated", (transaction) => {})
```

- `transaction` This is a [points transaction](#points-transaction), but has an additional property:

| Field                 | Type   | Description                                             |
| --------------------- | ------ | ------------------------------------------------------- |
| `adjustmentValue`     | number | The amount of points the transaction was adjusted by.   |

## Associated types

### Points transaction

Represents a points transaction.

| Field             | Type                                       | Description                                                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | string                                     | The unique ID of the transaction message.                                                                                                                                                                                                                                             |
| `createdAt`       | Date                                       | When the transaction was created created.                                                                                                                                                                                                                                             |
| `updatedAt`       | Date                                       | When the transaction was last updated created.                                                                                                                                                                                                                                        |
| `transactionType` | number                                     | The type of the transaction.                                                                                                                                                                                                                                                          |
| `extra`           | [Extra](#extra-object)?                    | Extra transaction properties. Varies based on transaction type.   |


### Extra object

This dictionary holds arbitrary metadata for the transaction and additional fields may be present.
It differs based on the type of the transaction.

#### Transaction Type 3 `media_enqueued_reward`
| Field                 | Type   | Description                                             |
| --------------------- | ------ | ------------------------------------------------------- |
| `media`               | string | The id of the media enqueue event.                      |

#### Transaction Type 5 `manual_adjustment`
| Field                 | Type   | Description                                             |
| --------------------- | ------ | ------------------------------------------------------- |
| `reason`              | string | The user-provided reason for the change.                |
| `adjusted_by`         | string | The address that performed the change.                  |

#### Transaction Type 7 `conversion_from_banano`
| Field                 | Type   | Description                                                    |
| --------------------- | ------ | -------------------------------------------------------------- |
| `tx_hash`             | string | The hash of the state block that sent the banano.              |

#### Transaction Type 13 `application_defined`
| Field                 | Type   | Description                                             |
| --------------------- | ------ | ------------------------------------------------------- |
| `application_id`      | string | The application that created the transaction.           |
| `application_version` | string | The version of the application.                         |
| `description`         | string | The transaction description, as set by the application. |

# Developing with JungleTV

# Running Locally
## Dependencies
## secrets-debug.json
Most of the keys are self explanatory. Here is some additional help/notes for the others.

### databaseURI

### walletSeed, jwtKey, raffleSecretKey
All three of these are 64 character hex strings (32 bytes). Most Banano wallets can generate wallet seeds, and therefore the jwtKey and raffleSecretKey.

Here is some Javascript code to do the same, if needed:
```js
function uint8_to_hex(uint8) {
  let hex_string = "";
  for (let i=0; i < uint8.length; i++) {
    let hex = uint8[i].toString(16);
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    hex_string += hex;
  }
  return hex_string.toUpperCase();
}
function random_bytes(bytes_num) {
  let uint8 = new Uint8Array(bytes_num);
  window.crypto.getRandomValues(uint8);
  return uint8;
}
console.log(uint8_to_hex(random_bytes(32)));
```

### representative
See [Creeper](https://creeper.banano.cc/representatives) for a list of representatives.

### certFile, keyFile
Run `/misc/gen_cert.sh` to generate these files.

### modLogWebhook
Optional, but to get the Discord webhook url, go to the settings of a Discord channel, go to "Integrations", then "Webhooks". Create a webhook, and copy the url.

Example url: https://discord.com/api/webhooks/XXX/YYY

Use this format: `XXX/YYY` (don't include the `https://discord.com/api/webhooks/` part, basically)

### tenorAPIkey
Not optional! Will not run if this is not provided.

# Integration
## Enqueue
`/enqueue?url=...`
The `url` query param will autofill the youtube video or soundcloud audio url for the user. Of course, the user still has to select additional options, and send payment. [Example](https://jungletv.live/enqueue?url=https://www.youtube.com/watch?v=MErFw9sRjLg)

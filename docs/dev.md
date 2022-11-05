# Developing with JungleTV

# Running Locally
First download the JungleTV repo by running `git clone https://github.com/tnyim/jungletv jungletv` where you want the repo to be (this will create folder `jungletv` containing the repo, in your current directory).

Alternatively, go to https://github.com/tnyim/jungletv, click "Code", then "Download ZIP". Unzip it to wherever you want the repo to be.

## Dependencies

### Installing Golang
The backend of JungleTV is written in Go. See the [Go website](https://go.dev/doc/install) for installation instructions.

### Installing Node.js and NPM
The frontend requires Node.js and NPM. Specifically, it is in typescript Svelte. See [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for installation instructions.

### Postgres
The database that JungleTV uses. Download Postgre, and set up the schema in `schema.sql`. Services like ElephantSQL provide free Postgre databases as an alternative to running Postgre locally.

To set up schema in pgAdmin4, click on the database, go to "Tool" then "Query tools" and paste in the contents of `schema.sql` and execute.

To set up schema in ElephantSQL, go to your instance, then "Browser" and paste in the contents of `schema.sql` and execute.

## secrets-debug.json
Follow instructions and fill out fields in `secrets-debug.example.json`.

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

`bash gen_cert.sh`

If on windows, you may need to turn on developer mode, and enable "Windows subsystem for Linux", and install a linux distribution (like Ubuntu on window store) in order to get bash working.

### modLogWebhook
Optional, but to get the Discord webhook url, go to the settings of a Discord channel, go to "Integrations", then "Webhooks". Create a webhook, and copy the url.

Example url: https://discord.com/api/webhooks/XXX/YYY

Use this format: `XXX/YYY` (don't include the `https://discord.com/api/webhooks/` part, basically)

### tenorAPIkey
Not optional! Will not run if this is not provided. The tenor developer dashboard currently instructs to get the api key [here](https://developers.google.com/tenor/guides/quickstart).

## Running
In the repo directory:

`go build`

Run the resulting `jungletv.exe`

Then in the `app` directory:

`npm install` then `npm run dev`

If all goes well, you can access your local instance of JungleTV at https://localhost:9090 or whatever you set the `websiteURL` key in `secrets-debug.json` to.

# Integration

## Enqueue
`/enqueue?url=...`
The `url` query param will autofill the youtube video or soundcloud audio url for the user. Of course, the user still has to select additional options, and send payment. [Example](https://jungletv.live/enqueue?url=https://www.youtube.com/watch?v=MErFw9sRjLg)

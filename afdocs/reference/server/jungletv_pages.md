# `jungletv:pages` module

The `jungletv:pages` module allows for serving application pages, which is web content that can be presented as stand-alone pages within the JungleTV website, or as part of the main JungleTV interface, with the help of the [`jungletv:configuration`](./jungletv_configuration.md) module.

This module is not imported by default. To use this module, import it in your server scripts as follows:

```js
const pages = require("jungletv:pages")
```

## Methods

### `publishFile()`

Publishes a new application page, or replaces a previously published one, that will have the specified file as its contents.

The page will have the URL `https://jungletv.live/apps/applicationID/pageID`, where `applicationID` is the ID of the running application, and `pageID` is the page ID specified.

The file to serve as the page contents must have the Public property set.

While this is not enforced, the file _should_ have the `text/html` MIME type, contain HTML and make use of the [App bridge](/reference/appbridge/) script, so that communication can occur between the application page and the rest of the JungleTV application and service.

Optionally, a set of specific headers can be overridden so that the served application page has access to web capabilities that are otherwise blocked by default, either by the relevant standards or by the defaults of the JungleTV AF.

#### Syntax

```js
pages.publishFile(pageID, fileName, defaultTitle)

let headers = {
    "Allowlisted-Header-Name": "Value",
    /* ..., */
}
pages.publishFile(pageID, fileName, defaultTitle, headers)
```

##### Parameters

- `pageID` - A case-sensitive string representing the ID of the page, that will define part of its URL.
  This ID is also used to reference the page in other methods, such as [`unpublish()`](#unpublish).
  This ID must contain only characters in the set A-Z, a-z, 0-9, `-` and `_`.
  If a page with this ID is already published, it will be replaced.
- `fileName` - The name of the application file to serve as the contents for this page.
  This file must have the Public property enabled.
- `defaultTitle` - A default, or initial, title for the page.
  This is the title that will be shown while the page is loading within the JungleTV application, or in other states where the final/current title of the application page can't be determined.
  When the page makes use of the [App bridge](/reference/appbridge/), its document title will be automatically synchronized, shadowing the value of this parameter.
- `headers` - An optional object containing a key-value set of strings representing HTTP headers and the respective values, that will be sent when the page is served.
  The list of allowed headers can be seen below.

**Allowed headers**

When serving the application page, JungleTV AF only allows a limited set of HTTP headers to be sent with the response.
The following headers are allowed:

- [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP): Specifies the content security policy for the page.
- [`Permissions-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy): Specifies the permissions policy for the page.
- [`Cross-Origin-Opener-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy): Specifies the opener policy for cross-origin resources.
- [`Cross-Origin-Embedder-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy): Specifies the embedder policy for cross-origin resources.
- [`Cross-Origin-Resource-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy): Specifies the resource policy for cross-origin resources.

For more information about each header, visit the corresponding MDN documentation page linked above.

##### Return value

None.

### `unpublish()`

Unpublishes a previously published application page.
If the page is being used as part of the interface through the [`jungletv:configuration`](./jungletv_configuration.md) module, then unpublishing the page will also cancel such usages.

#### Syntax

```js
pages.unpublish(pageID)
```

##### Parameters

- `pageID` - A case-sensitive string representing the ID of the page to unpublish.
  This ID must match the one used when the page was originally published.
  If the page is already unpublished, this function has no effect.

##### Return value

None.
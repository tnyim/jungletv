# `jungletv:configuration` module

The `jungletv:configuration` module allows for altering different aspects of JungleTV's presentation and behavior.

This module is not imported by default. To use this module, import it in your server scripts as follows:

```js
const configuration = require("jungletv:configuration")
```

## Methods

### `setAppName()`

Defines a custom website name to be used in place of "JungleTV".

The change is immediately reflected on all connected media-consuming clients, and is automatically undone when the application terminates.

Multiple JAF applications can request to override this configuration.
In such cases, the reflected value will be that of the application that most recently requested to override the configuration, and which is yet to terminate or cease overriding the configuration value.

#### Syntax

```js
configuration.setAppName(name)
```

##### Parameters

- `name` - The name to temporarily use for the JungleTV web application.
  When set to `null`, `undefined` or the empty string, the AF application will stop overriding the JungleTV web application name.

##### Return value

In circumstances where the AF runtime is working as expected, this function will return a `true` boolean.

### `setAppLogo()`

Defines a custom website logo to be used in place of the default one.
The image to use must be an application file that has the Public property set and has an image MIME type.

The change is immediately reflected on all connected media-consuming clients, and is automatically undone when the application terminates.

Multiple JAF applications can request to override this configuration.
In such cases, the reflected value will be that of the application that most recently requested to override the configuration, and which is yet to terminate or cease overriding the configuration value.

#### Syntax

```js
configuration.setAppLogo(filename)
```

##### Parameters

- `filename` - The name of the application file to serve as the JungleTV website logo.
  This file must have the Public property enabled and have an image MIME type.
  When set to `null`, `undefined` or the empty string, the AF application will stop overriding the JungleTV website logo.

##### Return value

In circumstances where the JAF runtime is working as expected, this function will return a `true` boolean.

### `setAppFavicon()`

Defines a custom website favicon to be used in place of the default one.
The image to use must be an application file that has the Public property set and has an image MIME type.

The change is immediately reflected on all connected media-consuming clients, and is automatically undone when the application terminates.

Multiple JAF applications can request to override this configuration.
In such cases, the reflected value will be that of the application that most recently requested to override the configuration, and which is yet to terminate or cease overriding the configuration value.

#### Syntax

```js
configuration.setAppFavicon(filename)
```

##### Parameters

- `filename` - The name of the application file to serve as the JungleTV website favicon.
  This file must have the Public property enabled and have an image MIME type.
  When set to `null`, `undefined` or the empty string, the JAF application will stop overriding the JungleTV website favicon.

##### Return value

In circumstances where the AF runtime is working as expected, this function will return a `true` boolean.

### `setSidebarTab()`

Sets an application page, registered with [publishFile()](./jungletv_pages.md#publishfile), to be shown as an additional sidebar tab on the JungleTV homepage.
The tab's initial title will be the default title passed to [publishFile()](./jungletv_pages.md#publishfile) when publishing the page.
When the page makes use of the [App bridge](/reference/appbridge/), its document title will be automatically synchronized with the tab title, **while the tab is visible/selected**.
When not selected, the tab **may** retain the most recent title until it is reopened or removed, **or** it **may** revert to the page's default title.

Currently, application sidebar tabs can't be popped out of the main JungleTV application window like built-in tabs can (e.g. by middle-clicking on the tab title).

The new sidebar tab becomes immediately available (but not immediately visible, i.e. the selected sidebar tab will not change) on all connected media-consuming clients, and is automatically removed when the application terminates or when the page is [unpublished](./jungletv_pages.md#unpublish).

Each JAF application can elect to show a single one of their application pages as a sidebar tab.
If the same application invokes this function with different pages as the argument, the sidebar tab slot available to that application will contain the page passed on the most recent invocation.

#### Syntax

```js
configuration.setSidebarTab(pageID)
configuration.setSidebarTab(pageID, beforeTabID)
```

##### Parameters

- `pageID` - A case-sensitive string representing the ID of the page to use as the content for the tab, as was specified when invoking [publishFile()](./jungletv_pages.md#publishfile).
  When set to `null`, `undefined` or the empty string, the sidebar tab slot for the JAF application will be removed.
  Connected users with the application's tab active will see an immediate switch to another sidebar tab.
- `beforeTabID` - An optional string that allows for controlling the placement of the new sidebar tab relative to the built-in sidebar tabs.
  The application's tab will appear to the left of the specified built-in tab. The built-in tab IDs are: `queue`, `skipandtip`, `chat` and `announcements`.
  If this argument is not specified, the tab will appear to the right of all the built-in tabs.
  The application framework is not designed to let applications control the placement of their tab relative to the tabs of other JAF applications.
  The placement of an application's tab relative to the tabs of other applications may change every time this function is invoked.

##### Return value

In circumstances where the AF runtime is working as expected, this function will return a `true` boolean.
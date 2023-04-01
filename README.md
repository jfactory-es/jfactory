<div align="center" markdown="1">
<img width="140" src="https://jfactory-es.github.io/jfactory/img/jFactory.png">

Easily modularize your application into cancelable components.<br>
<b>Everything they initialize can be monitored, stopped and removed automatically,<br>
including views, nested promises, requests, listeners, DOM and CSS.</b>

[![GitHub version](https://img.shields.io/github/package-json/v/jfactory-es/jfactory.svg?label=git)](https://github.com/jfactory-es/jfactory)
[![npm version](https://img.shields.io/npm/v/jfactory.svg)](https://www.npmjs.com/package/jfactory)
[![Tests](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)](#implementation)

</div>

# jFactory

- Easily transform any Object or Class into robust web components.
- Implement an awaitable **Component Lifecycle** - install, enable, disable, and uninstall.
- **Subscribe for side effects** such as CSS, DOM, event listeners, observers, timers, requests, and nested promise trees.
- **Automatically await subscriptions** at each phase of the component lifecycle (loading CSS, requests, promise trees...).
- **Automatically switch off subscriptions** at the opposite phase of the component lifecycle (install --> uninstall, enable --> disable).
- Prevent expired asynchronous calls, such as nested promise trees and requests.
- Debug with ease using filterable nested loggers.
- **Keep track in DevTools** of all named subscriptions (listeners, timers, requests, promises, dom, css...)
- Improve promise chains with **Awaitable/Expirable nested Promise trees**.

\

<div align="center">
 
 | Installation                         | Documentation                                                                                                                                                                                                                                                                                      |
 |--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | ```npm add lodash jquery jfactory``` | [Index](https://github.com/jfactory-es/jfactory/tree/master/docs/index.md) / [Traits](https://github.com/jfactory-es/jfactory/tree/master/docs/ref-index.md#traits-component-features) / [Classes](https://github.com/jfactory-es/jfactory/tree/master/docs/ref-index.md#classes-internal-library) |

</div>

## Overview

Components **[can be extended from any Class](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-components.md)**,
or more simply by using an Object Literal through the shortcut [`jFactory()`](ref-components.md#create-a-component-literal):

```javascript
let component = jFactory("myComponent", {

  onInstall() {
    this.$domFetch("myDom", "asset.html", "body");
    this.$cssFetch("myCss", "asset.css");
  },

  onEnable() {
    this.$interval("myUpdater", 1000, () =>
      this.$fetchJSON("myRequest", "asset.json")
        .then(data => this.$log("updated", data))
    );
    this.$on("click", "#bt-switch", () => this.mySwitchHandler());
    this.$on("click", "#bt-close", () => this.myCloseHandler());
  },

  async mySwitchHandler() {
    await (this.$.states.enabled ? this.$disable() : this.$enable());
    this.$log(this.$.states.enabled);
  },

  myCloseHandler() {
    this.$uninstall();
  }

})

await component.$install();
await component.$enable();
```

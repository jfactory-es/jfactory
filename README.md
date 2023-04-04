<div align="center" markdown="1">
<img width="140" src="https://jfactory-es.github.io/jfactory/img/jFactory.png">

Easily modularize your application into cancelable components.<br>
<b>Everything they initialize can be monitored, stopped and removed automatically,<br>
including views, nested promises, requests, listeners, DOM and CSS.</b>

[![npm version](https://img.shields.io/npm/v/jfactory.svg)](https://www.npmjs.com/package/jfactory)
[![GitHub version](https://img.shields.io/github/package-json/v/jfactory-es/jfactory.svg?label=git)](https://github.com/jfactory-es/jfactory)
[![Tests](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)](#implementation)

</div>

# jFactory

[//]: # (Easily transform any Object or Class into robust component.)
[//]: # (<img align="right" src="https://jfactory-es.github.io/jfactory/img/pic1.png">)
[//]: # (- Prevent expired asynchronous calls, such as nested promise trees and requests.)
[//]: # (- Improve promise chains with **Awaitable/Expirable nested Promise trees**.)

- **Component lifecycles**: Provides asynchronous `install`, `enable`, `disable`, and `uninstall` functionality.
- **Automatically subscribes** in a registry when adding CSS, DOM, event listeners, observers, timers, requests, nested promise trees, ...
- **Automatically await pending subscriptions** when calling `await install` and `await enable`, everything is parallelized into tasks.
- **Automatically switch off subscriptions** at the opposite phase of the component lifecycle : `uninstall` reverts `install`, `disable` reverts `enable`.
- **Lifecycles events**: Listen to phase changes. Prepare or clean up asynchronously what you need before automation. 
- **Abortable and Expirable:** Tasks, nested promise trees and requests can be canceled.
- **Easy to learn and use:** Not a framework, ES6 highly modular, use what you need. Create your own plugins to automatically register and clean up other side effects.
- **DevTools:** Component-level logging, name-prefixed logs, filters, sub loggers with inheritance. 
- **Debugging:** Everything is named. Keep track of the subscriptions (listeners, timers, requests, promises, dom, css...).
- [...and much more, take a closer look](https://github.com/jfactory-es/jfactory/blob/master/docs/index.md).

<div align="center">
 
 | [Installation](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-import.md) | [Documentation](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md)                                                                                                                                |
 |----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | ```npm add jfactory```                                                                 | [Traits](https://github.com/jfactory-es/jfactory/tree/master/docs/ref-index.md#traits-component-features) / [Classes](https://github.com/jfactory-es/jfactory/tree/master/docs/ref-index.md#classes-internal-library) |

</div>

## Overview

Components **[can be extended from any Class](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-components.md)**,
or more simply by using an Object literal through the shortcut [`jFactory()`](ref-components.md#create-a-component-literal):

```javascript
let component = jFactory("myComponent", {

  async onInstall() {
    this.$domFetch("myDom", "asset.html", "body");
    this.$cssFetch("myCss", "asset.css");
  },

 async onEnable() {
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

  async myCloseHandler() {
   // Called by the click event on #bt-close
   // Everything in the component registery is automatically stoped and removed:
   // (myDom, myCss, myUpdater, myRequest, DOM events)
   // Residual callbacks not manually stopped from 
   // the onDisable() and onUninstall() handlers will be ignored.    
   await this.$uninstall();
  }

})

await component.$install();
await component.$enable();
```

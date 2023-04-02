
<div align="center" markdown="1">
<img width="140" src="https://jfactory-es.github.io/jfactory/img/jFactory.png">

Easily modularize your javascript application into cancelable components.<br>

[//]: # (Easily transform any Object or Class into robust component.)

[![GitHub version](https://img.shields.io/github/package-json/v/jfactory-es/jfactory.svg?label=git)](https://github.com/jfactory-es/jfactory)
[![npm version](https://img.shields.io/npm/v/jfactory.svg)](https://www.npmjs.com/package/jfactory)
[![Tests](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)](#implementation)

</div>

# jFactory

[//]: # (Easily transform any Object or Class into robust web components.)
[//]: # (<img align="right" src="https://jfactory-es.github.io/jfactory/img/pic1.png">)

- Implement an awaitable **Component Lifecycle** - install, enable, disable, and uninstall.
- **Subscribe for side effects** such as CSS, DOM, event listeners, observers, timers, requests, and nested promise trees.
- **Automatically await subscriptions** at each phase of the component lifecycle (loading CSS, requests, promise trees...).
- **Automatically switch off subscriptions** at the opposite phase of the component lifecycle (install >> uninstall, enable >> disable).
- Prevent expired asynchronous calls, such as nested promise trees and requests.
- Debug with ease using component filterable nested loggers.
- **Keep track in DevTools** of all named subscriptions (listeners, timers, requests, promises, dom, css...)
- Improve promise chains with **Awaitable/Expirable nested Promise trees**.

<br>

<div align="center">

| [Installation](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-import.md) | [Documentation](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md)                                                                                                                                |
|----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 
[Playground](playground/README.md) -
[Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

</div>

<!--
## Learning

jFactory is an easy-to-learn library. Unlike a framework, it does not impose an architecture: you are free to use only what you need.
-->

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

<!--

## Supported APIs <img height="20" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"> <img height="20" src="https://vuejs.org/images/logo.png"> <img height="20" src="https://jfactory-es.github.io/jfactory/img/HTML5.png">

jFactory supports **Vue.js**, **React**, and **HTML5 WebComponents** allowing components to automatically **uninstall** and **reinstall** their views.
See [Playground](playground/README.md).

-->

## Patterns

- Registry: all component subscriptions (listeners, promises, timers, fetch, dom...) are explorable in a registry, allowing quick visual inspections in DevTools.

- [Tasks](TraitTask.md): asynchronous processes can be registered as expirable tasks that block the current Service State Change, guaranteeing that everything is resolved before completing it, including all subpromises.

- [Remove Phase](TraitService-Phases.md#remove-phase): jFactory will automatically stop and remove the subscriptions (listeners, promises, timers, fetch, dom...) registered during an opposite state change (install/uninstall, enable/disable)

- [Promise Chains](JFactoryPromise.md): jFactory uses extended native Promises that makes the whole Chain[ Awaitable](JFactoryPromise.md#chain-awaitable), [Completable](JFactoryPromise.md#chain-completion--cancellation), [Cancelable](JFactoryPromise.md#chain-completion--cancellation) and [Expirable](JFactoryPromise.md#chain-expiration).

- [Traits](ref-components.md#create-a-component-base-class): Components are Objects created from Classes dynamically extended by JFactoryTraits.

- Debug: jFactory is designed for asynchronous component-based application development, using contextual loggers and subloggers,
  filterable source-mapped stack traces, identifiers, loggable extended errors, explorable promise chains, ...

## Library

jFactory is designed with powerful ES6 [Classes](ref-index.md#classes-internal-library):

- [Extended Promise](JFactoryPromise.md)
  - Expirable, awaitable, explorable Promise Chain.
  - Status properties.
- Composite Functions.
  - Wrappable / Conditional / Expirable Functions.
- Awaitable asynchronous observers.
- Traits, for dynamic mixins with configurable parser.
- Loggers, with identified and formatted console logs and inherited switches.
- Errors, with explorable data.
- Stack traces, filterable and source mapped.

## Philosophy

- Does not modify JavaScript prototypes.
- Injected methods and properties are prefixed to avoid conflicts.
- Most names are prefixed by affiliation for easier code completion.
- All registrations must be named, to reinforce debugging.
- Most of the library is overridable.
- Designed for debugging and inspections.

###### Modular JavaScript

- Written in ES6+ optimized for Tree Shaking.
- Highly configurable, overridable and dynamically patchable.
- Interoperable. Framework-agnostic. No transpiler.
- Provides a "Developer Build" for additional validations and debugging properties.

<!--
## Implementation

- Supports Vue.js, React and HTML5 Web Components
- Supports Promises, Listeners, Timers, Mutations, DOM, CSS   
- Dependencies: jQuery, Lodash
-->
## How to Contribute

jFactory is an Open Source project. Your comments, bug reports and code proposals are always welcome. This project is new and you can help a lot by spreading the word. Also consider adding a github star, as it seems very important for its visibility at this stage. Thank you for your contributions! 

<div align="center">
<img width="140" src="https://jfactory-es.github.io/jfactory/img/jFactory.png">
</div>
<br>

<div align="center">
Easily modularize your application into cancelable components.<br>
<b>Everything they initialize can be monitored, stopped and removed automatically,<br>
including views, promise chains, requests, listeners, DOM and CSS.</b>
</div>

<div align="center" markdown="1">

[![GitHub version](https://img.shields.io/github/package-json/v/jfactory-es/jfactory.svg?label=git)](https://github.com/jfactory-es/jfactory)
[![npm version](https://img.shields.io/npm/v/jfactory.svg)](https://www.npmjs.com/package/jfactory)
[![Tests](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)](#implementation)
</div>

# jFactory

**Why?** Imagine a feature that uses views, css, event listeners, requests and asynchronous processes with promise chains.
jFactory groups all this together into a component object that provides the methods `$install(), $enable(), $disable() and $uninstall()`. Now, you can safely stop, unload or restart the component, making your asynchronous application easier to control and clean.

* [Playground](playground/README.md)
* [Installation](ref-import.md) / [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)
* [Documentation](ref-index.md) / [Traits](ref-index.md#traits-component-features) / [Classes](ref-index.md#classes-internal-library)

## Abstract

jFactory components are able to:

- operate like a service (install, enable, disable, uninstall)
- automatically switch off subscribed css, dom, event listeners, observers, timers, requests, promise chains and views.
- automatically prevent expired asynchronous calls (promise subtrees, event handlers...)
- automatically ensure that the promise chains are completed at service state change (awaitable)
- keep track in DevTools of all running subscriptions (listeners, timers, requests, promises, dom, css...)
- log messages in console with controllable loggers
- improve the Promise chains (Awaitable/Expirable promise tree)
- easily create/load CSS & DOM and clone from \<template>

## Supported APIs <img height="20" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"> <img height="20" src="https://vuejs.org/images/logo.png"> <img height="20" src="https://jfactory-es.github.io/jfactory/img/HTML5.png">

jFactory supports **Vue.js**, **React**, and **HTML5 WebComponents** allowing components to automatically **uninstall** and **reinstall** their views.
See [Playground](playground/README.md).

## Overview

In a nutshell, jFactory provides methods to register listeners, views, dom, css, requests and asynchronous tasks that will be automatically stopped (including subpromise trees) and removed at opposite service state change (install/uninstall, enable/disable).

Components **[can be created from any Class](ref-components.md)**,
or more simply by using an Object Literal through the shortcut [`jFactory()`](ref-components.md#create-a-component-literal):

```javascript
let component = jFactory("myComponent", {

  onInstall() {
    // create, insert and register a DOM container
    // (jFactory can also use templates, vue and react, load assets...)
    this.$dom("#containerDiv", '<div>', "body")
      .append(
        '<button id="bt-switch">switch</button>' +
        '<button id="bt-close">close</button>');

    // load a CSS asynchronously
    this.$cssFetch("myCss", "asset.css");

    this.$on("click", "#bt-switch", () => this.mySwitchHandler());
    this.$on("click", "#bt-close", () => this.myCloseHandler());
  },

  onEnable() {
    this.$interval("myUpdater", 1000, () =>
      this.$fetchJSON("myRequest", "asset.json")
        .then(data => this.$log("updated", data))
    );
  },

  async mySwitchHandler() {
    await (this.$.states.enabled ? this.$disable() : this.$enable());
    this.$log(this.$.states.enabled);
  },

  myCloseHandler() {
    // stop and remove:
    // dom container, css, listeners, intervals, requests, promises...
    this.$uninstall();
  }
})

// install and enable the component
await component.$install(true);
```
[Playground](playground/README.md) / [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

## Learning

jFactory is an easy-to-learn library. Unlike a framework, it does not impose an architecture: you are free to use only what you need.

All the [methods are listed here](ref-index.md#traits-component-features). \
See also the [Playground](playground/README.md) and the [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

## Patterns

- Registry:<img align="right" src="https://jfactory-es.github.io/jfactory/img/pic1.png"> all component subscriptions (listeners, promises, timers, fetch, dom...) are explorable in a registry, allowing quick visual inspections in DevTools.

- [Tasks](TraitTask.md): asynchronous processes can be registered as expirable tasks that block the current Service State Change, guaranteeing that everything is resolved before completing it, including all subpromises.

- [Remove Phase](TraitService-Phases.md#remove-phase): jFactory will automatically stop and remove the subscriptions (listeners, promises, timers, fetch, dom...) registered during an opposite state change (install/uninstall, enable/disable)

- [Promise Chains](JFactoryPromise.md): jFactory uses extended native Promises that makes the whole Chain[ Awaitable](JFactoryPromise.md#chain-awaitable), [Completable](JFactoryPromise.md#chain-completion--cancellation), [Cancelable](JFactoryPromise.md#chain-completion--cancellation) and [Expirable](JFactoryPromise.md#chain-expiration).

- [Traits](ref-components.md#create-a-component-base-class): Components are Objects created from Classes dynamically extended by JFactoryTraits.

- Debug: jFactory is designed for asynchronous component-based application development, using contextual loggers and subloggers,
  filterable source-mapped stack traces, identifiers, loggable extended errors, explorable promise chains, ...

## Library

jFactory is designed with powerful ES6 [Classes](ref-index.md#classes-internal-library):

- [Extended Promise](JFactoryPromise.md)
  - Expirable, awaitable, explorable Promise Chain
  - Status properties
- Composite Functions
  - Wrappable / Conditional / Expirable Functions
- Awaitable asynchronous observers
- Traits, for dynamic mixins with configurable parser
- Loggers, with identified and formatted console logs and inherited switches
- Errors, with explorable data
- Stack traces, filterable and source mapped

## Philosophy

- Does not modify JavaScript prototypes
- Injected methods and properties are prefixed to avoid conflicts
- Most names are prefixed by affiliation for easier code completion
- All registrations must be named, to reinforce debugging
- Most of the library is overridable
- Designed for debugging and inspections

###### Modular JavaScript

- Written in ES6+ optimized for Tree Shaking
- Highly configurable, overridable and dynamically patchable
- Interoperable. Framework-agnostic. No transpiler.
- Provides a "Developer Build" for additional validations and debugging properties

<!--
## Implementation

- Supports Vue.js, React and HTML5 Web Components
- Supports Promises, Listeners, Timers, Mutations, DOM, CSS   
- Dependencies: jQuery, Lodash
-->
## How to Contribute

jFactory is an Open Source project. Your comments, bug reports and code proposals are always welcome. This project is new and you can help a lot by spreading the word. Also consider adding a github star, as it seems very important for its visibility at this stage. Thank you for your contributions! 

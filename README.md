# jFactory
<img align="right" width="140" src="https://jfactory-es.github.io/jfactory/img/jFactory.png">jFactory is a free JavaScript library that allows you to easily compartmentalize your application into components. Thus, everything they initialize can be  tracked, stopped and removed automatically.

Imagine a web component that displays a DOM window with its CSS, loads data and performs various asynchronous and timed processes. **Simply call `myComponent.$uninstall()` to automatically interrupt and uninstall the DOM, CSS, promise chains, queries, timers, and event listeners.** 

```
npm add jfactory-es
```

* [Documentation](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md) / [Traits](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md#traits-component-features) / [Classes](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md#classes-internal-library)
* [Installation & Dependencies](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-import.md)
* [CodePen](https://codepen.io/jfactory-es/pen/KKwxaqr?editors=1010) /  [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

## Abstract

jFactory components are able to:

- operate like a service (install, enable, disable, uninstall) 
- automatically switch off subscribed listeners, timers, requests, promises, <!--callbacks, -->dom, css... 
- automatically prevent all expired asynchronous calls (<!--callbacks, -->promise subtrees, event handlers...) 
- automatically ensure that all the promise chains are completed at service state change
- keep track in DevTools of all running subscriptions (listeners, timers, requests, promises, dom, css...)
- improve the Promise chains (Awaitable, Completable, Cancelable and Expirable) 

## Overview

In a nutshell, jFactory provides methods to register listeners, dom, css, fetch and asynchronous tasks that will be automatically stopped (including subpromise trees) and removed at oposite service state change. 

Components can be created from an Object Literal, using the shortcut [`jFactory()`](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-components.md#create-a-component-literal), or
alternatively, **any Class can be extended into a Component** using [JFactoryTraits](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-components.md#create-a-component-base-class).  

```javascript
let component = jFactory("myComponent", {
  onInstall() {
    this.$cssFetch("#myCSS", "asset.css").then(() => this.$log("css loaded"))
  },

  onEnable() {
    this.$interval("myUpdater", 250, () =>
      this.$fetchJSON("myRequest", "asset.json").then(() => this.$log("updated"))
    )
  }

  // ... your own methods and properties
})

await component.$install(); 
await component.$enable();
await component.$disable(); 
await component.$uninstall();  
```
* [Try on CodePen](https://codepen.io/jfactory-es/pen/KKwxaqr?editors=1010)
* [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)


## Patterns

- Registry:<img align="right" src="https://jfactory-es.github.io/jfactory/img/pic1.png"> all component subscriptions (listeners, promises, timers, fetch, dom...) are explorable in a registry, allowing quick visual inspections in DevTools.

- [Tasks](https://github.com/jfactory-es/jfactory/blob/master/docs/TraitTask.md): asynchronous processes can be registered as expirable tasks that block the current Service State Change, guaranteeing that everything is resolved before completing it, including all subpromises. 

- [Remove Phase](https://github.com/jfactory-es/jfactory/blob/master/docs/TraitService-Phases.md#remove-phase): jFactory will automatically stop and remove the subscriptions (listeners, promises, timers, fetch, dom...) registered during an opposite state change (install/uninstall, enable/disable)

- [Promise Chains](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md): jFactory uses extended native Promises that makes the whole Chain[ Awaitable](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md#chain-awaitable), [Completable](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md#chain-completion--cancellation), [Cancelable](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md#chain-completion--cancellation) and [Expirable](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md#chain-expiration).

- [Traits](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-components.md#create-a-component-base-class): Components are Objects created from Classes dynamically extended by JFactoryTraits. 

- Debug: jFactory is designed for asynchronous component-based application development, using contextual loggers and subloggers,
 filterable source-mapped stack traces, identifiers, loggable extended errors, explorable promise chains, ...

     
## Internal Framework   

jFactory is entirely designed from importable ES6+ Classes that provides theses features: 

- [Extended Promise](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md)
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
- Most of the library is overridable (no inaccessible private function)
- Designed for debugging and inspections

## Modular JavaScript
  
- Written in ES6+ Modules with Class optimized for Tree Shaking
- Highly configurable, overridable and dynamically patchable
- Interoperable. Framework-agnostic. No transpiler.  
- Provides a "Developer Build" for additional validations and debugging properties   

## Implementation
[![npm version](https://img.shields.io/npm/v/jfactory-es.svg)](https://www.npmjs.com/package/jfactory-es)
[![GitHub version](https://img.shields.io/github/package-json/v/jfactory-es/jfactory.svg?label=git)](https://github.com/jfactory-es/jfactory)
[![Tests](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)](#implementation)
<!--
[![](https://img.shields.io/github/issues/jfactory-es/jfactory.svg?style=flat)](#implementation)
[![](https://img.shields.io/snyk/vulnerabilities/npm/jfactory-es.svg)](#implementation) 
-->
- External Dependencies: jQuery, Lodash (may be removed in next releases)

## How to Contribute

jFactory is an Open Source project. Your comments, bug reports and code proposals are always welcome. This project is new and you can help a lot by spreading the word. Also consider adding a github star, as it seems very important for its visibility at this stage. Thank you for your contributions! 
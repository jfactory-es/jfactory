# jFactory
<img align="right" width="140" src="img/jFactory.png">jFactory is a free JavaScript library that allows you to easily compartmentalize your application into components. Thus, everything they initialize can be  tracked, stopped and removed automatically.

Imagine a component that use Vue.js to display a view with its CSS, loads data and performs various asynchronous and timed processes. **Simply call `myComponent.$uninstall()` to automatically interrupt and uninstall the Vue, DOM, CSS, promise chains, queries, timers, and event listeners.** 

* [Installation](ref-import.md)
* [Documentation](ref-index.md) / [Traits](ref-index.md#traits-component-features) / [Classes](ref-index.md#classes-internal-library)
* [CodePen](index-playground.md) /  [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

## Abstract

jFactory components are able to:

- operate like a service (install, enable, disable, uninstall) 
- automatically switch off subscribed listeners, timers, requests, promises, <!--callbacks, -->dom, css... 
- automatically prevent all expired asynchronous calls (<!--callbacks, -->promise subtrees, event handlers...) 
- automatically ensure that all the promise chains are completed at service state change
- keep track in DevTools of all running subscriptions (listeners, timers, requests, promises, dom, css...)
- improve the Promise chains (Awaitable, Completable, Cancelable and Expirable)
- easily create/load CSS & DOM and clone from \<template> 

## Supported libraries

<img align="left" height="40" src="https://vuejs.org/images/logo.png">jFactory supports Vue.js objects,
 making components able to automatically uninstall/reinstall their views from templates.
See [Playground](index-playground.md#vuejs).

## Overview

In a nutshell, jFactory provides methods to register listeners, dom, css, fetch and asynchronous tasks that will be automatically stopped (including subpromise trees) and removed at oposite service state change (install/uninstall, enable/disable). 

Components **[can be created from any Class](ref-components.md)**, 
or by using a simple Object Literal through the shortcut [`jFactory()`](ref-components.md#create-a-component-literal):  

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
[CodePen](index-playground.md) / [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

## Is that complicated?

jFactory is an easy-to-learn library based on jQuery. Unlike a framework, it does not impose an application architecture: you are free to use only what you want without restriction. 

All the [methods are listed here](ref-index.md#traits-component-features).

## Patterns

- Registry:<img align="right" src="img/pic1.png"> all component subscriptions (listeners, promises, timers, fetch, dom...) are explorable in a registry, allowing quick visual inspections in DevTools.

- [Tasks](TraitTask.md): asynchronous processes can be registered as expirable tasks that block the current Service State Change, guaranteeing that everything is resolved before completing it, including all subpromises. 

- [Remove Phase](TraitService-Phases.md#remove-phase): jFactory will automatically stop and remove the subscriptions (listeners, promises, timers, fetch, dom...) registered during an opposite state change (install/uninstall, enable/disable)

- [Promise Chains](JFactoryPromise.md): jFactory uses extended native Promises that makes the whole Chain[ Awaitable](JFactoryPromise.md#chain-awaitable), [Completable](JFactoryPromise.md#chain-completion--cancellation), [Cancelable](JFactoryPromise.md#chain-completion--cancellation) and [Expirable](JFactoryPromise.md#chain-expiration).

- [Traits](ref-components.md#create-a-component-base-class): Components are Objects created from Classes dynamically extended by JFactoryTraits. 

- Debug: jFactory is designed for asynchronous component-based application development, using contextual loggers and subloggers,
 filterable source-mapped stack traces, identifiers, loggable extended errors, explorable promise chains, ...
     
## Library   

jFactory is designed from [ES6 Classes](ref-index.md#classes-internal-library):

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
- Most of the library is overridable (no inaccessible private function)
- Designed for debugging and inspections

###### Modular JavaScript
  
- Written in ES6+ Modules with Class optimized for Tree Shaking
- Highly configurable, overridable and dynamically patchable
- Interoperable. Framework-agnostic. No transpiler.  
- Provides a "Developer Build" for additional validations and debugging properties   

## Implementation
[![GitHub version](https://img.shields.io/github/package-json/v/jfactory-es/jfactory.svg?label=git)](https://github.com/jfactory-es/jfactory)
[![npm version](https://img.shields.io/npm/v/jfactory-es.svg)](https://www.npmjs.com/package/jfactory-es)
[![Tests](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)](#implementation)
<!--
[![](https://img.shields.io/github/issues/jfactory-es/jfactory.svg?style=flat)](#implementation)
[![](https://img.shields.io/snyk/vulnerabilities/npm/jfactory-es.svg)](#implementation) 
-->

- Supports Vue.js
- Supports Promises, Listeners, Timers, DOM, CSS   
- Dependencies: jQuery, Lodash

## How to Contribute

jFactory is an Open Source project. Your comments, bug reports and code proposals are always welcome. This project is new and you can help a lot by spreading the word. Also consider adding a github star, as it seems very important for its visibility at this stage. Thank you for your contributions! 

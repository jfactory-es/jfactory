# jFactory
<img align="right" width="140" src="https://jfactory-es.github.io/jfactory/img/jFactory.png">jFactory is an Open Source JavaScript library that allows you to easily compartmentalize your application into components. 
Thus, **everything they initialize can be monitored, stopped and removed automatically.**

**Why?** Imagine a feature in your application that uses views, css, event listeners, requests and asynchronous processes. 
jFactory groups all this together into a component object that provides the methods `$install(), $enable(), $disable() and $uninstall()`. Now, you can safely stop, remove or restart the component, making your asynchronous application easier to control and clean.  

<!--
jFactory is easy to learn and offers useful features for developing single-page applications.
-->

* [Playground](https://github.com/jfactory-es/jfactory/blob/master/docs/playground/README.md) 
* [Installation](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-import.md) / [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)
* [Documentation](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md) / [Traits](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md#traits-component-features) / [Classes](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md#classes-internal-library)

## Abstract

jFactory components are able to:

- operate like a service (install, enable, disable, uninstall) 
- automatically switch off subscribed css, dom, event listeners, observers, timers, requests, promise chains and views. 
- automatically prevent all expired asynchronous calls (promise subtrees, event handlers...) 
- automatically ensure that all the promise chains are completed at service state change
- keep track in DevTools of all running subscriptions (listeners, timers, requests, promises, dom, css...)
- improve the Promise chains (Awaitable, Completable, Cancelable and Expirable)
- easily create/load CSS & DOM and clone from \<template> 

## Supported APIs
<img align="left" height="40" src="https://vuejs.org/images/logo.png"> 
<img align="left" height="40" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg">
<img align="left" height="40" src="https://jfactory-es.github.io/jfactory/img/HTML5.png"> 

jFactory also supports **Vue.js**, **React**, and **HTML5 WebComponents** allowing components to automatically **uninstall** and **reinstall** their views.
See [Playground](https://github.com/jfactory-es/jfactory/blob/master/docs/playground/README.md).

## Overview

In a nutshell, jFactory provides methods to register listeners, views, dom, css, requests and asynchronous tasks that will be automatically stopped (including subpromise trees) and removed at opposite service state change (install/uninstall, enable/disable). 

Components **[can be created from any Class](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-components.md)**, 
or by using a simple Object Literal through the shortcut [`jFactory()`](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-components.md#create-a-component-literal):  

```javascript
let component = jFactory("myComponent", {
  onInstall() {
    this.$domFetch("#myDiv", "asset.html", "#parent").then(() => this.$log("html loaded"));
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
[Playground](https://github.com/jfactory-es/jfactory/blob/master/docs/playground/README.md) / [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

## Learning

jFactory is an easy-to-learn library based on jQuery. Unlike a framework, it does not impose an application architecture: you are free to use only what you want without restriction. 

All the [methods are listed here](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md#traits-component-features). \
See also the [Playground](https://github.com/jfactory-es/jfactory/blob/master/docs/playground/README.md) and the [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

## Patterns

- Registry:<img align="right" src="https://jfactory-es.github.io/jfactory/img/pic1.png"> all component subscriptions (listeners, promises, timers, fetch, dom...) are explorable in a registry, allowing quick visual inspections in DevTools.

- [Tasks](https://github.com/jfactory-es/jfactory/blob/master/docs/TraitTask.md): asynchronous processes can be registered as expirable tasks that block the current Service State Change, guaranteeing that everything is resolved before completing it, including all subpromises. 

- [Remove Phase](https://github.com/jfactory-es/jfactory/blob/master/docs/TraitService-Phases.md#remove-phase): jFactory will automatically stop and remove the subscriptions (listeners, promises, timers, fetch, dom...) registered during an opposite state change (install/uninstall, enable/disable)

- [Promise Chains](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md): jFactory uses extended native Promises that makes the whole Chain[ Awaitable](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md#chain-awaitable), [Completable](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md#chain-completion--cancellation), [Cancelable](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md#chain-completion--cancellation) and [Expirable](https://github.com/jfactory-es/jfactory/blob/master/docs/JFactoryPromise.md#chain-expiration).

- [Traits](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-components.md#create-a-component-base-class): Components are Objects created from Classes dynamically extended by JFactoryTraits. 

- Debug: jFactory is designed for asynchronous component-based application development, using contextual loggers and subloggers,
 filterable source-mapped stack traces, identifiers, loggable extended errors, explorable promise chains, ...
     
## Library   

jFactory is designed from [ES6 Classes](https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md#classes-internal-library):

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
- Most of the library is overridable
- Designed for debugging and inspections

###### Modular JavaScript
  
- Written in ES6+ Modules with Class optimized for Tree Shaking
- Highly configurable, overridable and dynamically patchable
- Interoperable. Framework-agnostic. No transpiler.  
- Provides a "Developer Build" for additional validations and debugging properties   

## Implementation
[![GitHub version](https://img.shields.io/github/package-json/v/jfactory-es/jfactory.svg?label=git)](https://github.com/jfactory-es/jfactory)
[![npm version](https://img.shields.io/npm/v/jfactory.svg)](https://www.npmjs.com/package/jfactory)
[![Tests](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)](#implementation)
<!--
[![](https://img.shields.io/github/issues/jfactory-es/jfactory.svg?style=flat)](#implementation)
[![](https://img.shields.io/snyk/vulnerabilities/npm/jfactory.svg)](#implementation) 
-->

- Supports Vue.js, React and HTML5 Web Components
- Supports Promises, Listeners, Timers, Mutations, DOM, CSS   
- Dependencies: jQuery, Lodash

## How to Contribute

jFactory is an Open Source project. Your comments, bug reports and code proposals are always welcome. This project is new and you can help a lot by spreading the word. Also consider adding a github star, as it seems very important for its visibility at this stage. Thank you for your contributions! 

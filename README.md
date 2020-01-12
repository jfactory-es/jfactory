# jFactory
jFactory is a JavaScript library that allows you to easily compartmentalize your application into components. Thus, all the actions you perform in your components can be tracked, stopped and removed automatically. 

For example, let's imagine a (web/react/...) component that displays a DOM window with its CSS, loads data and performs various asynchronous and timed processes. Simply call the `$uninstall()` method of your component to automatically remove the DOM, uninstall the CSS, interrupt the promise chains, the queries, timers, and remove the event listeners. 

```shell script
npm add jfactory-es
```

* [Documentation](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-index.md) / [Traits](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-index.md#traits-component-features) / [Classes](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-index.md#classes-internal-library)
* [Installation & Dependencies](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-import.md)

[&nbsp;&nbsp;&nbsp;**>> Starter Kit <<**](https://github.com/jfactory-es/jfactory-starterkit)

## Abstract

jFactory easily compartmentalize your application into components that can:

- operate like services (install, enable, disable, uninstall) 
- automatically ensure that all the promise chains are completed at service state change
- automatically switch off subscribed listeners, timers, requests, promises, <!--callbacks, -->dom, css... 
- automatically prevent all expired asynchronous calls (<!--callbacks, -->promise subtrees, event handlers...) 
- keep track in DevTools of all running subscriptions (listeners, timers, requests, promises, dom, css...)
- improve the Promise chains (Awaitable, Completable, Cancelable and Expirable) 

## Overview

In a nutshell, jFactory provides methods to register listeners, dom, css, fetch and asynchronous tasks that will be automatically stopped (including subpromise trees) and removed at oposite service state change. 

 jFactory ensures that before resolving a [Service State Change](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitService-Phases.md), all asynchronous actions of the associated [Service Handler](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitService-States.md#service-state-handlers) are completed, including subpromises. 
```javascript
import { jFactory } from "jfactory-es"

let component = jFactory("myComponent", {

  onInstall() {
    this.$cssFetch("#myComponent-css", "/asset.css");
    this.$domFetch("#myComponent-div", "/asset.html").then(dom => dom.appendTo("body"));
    this.$task("myInitTask", new Promise(resolve => wait(500).then(resolve)))
      .then(() => this.$log('done'))
  },

  onEnable() {
    this.$interval("myUpdater", 250, () =>
      this.$fetchJSON("myRequest", "/asset.json").then(() => this.$log("updated"))
    )
  }
  
  // ... 

});

await component.$install(); 
await component.$enable();
await wait(1000); // interval and requests are running 

// stops/removes everything started during and after onEnable()
await component.$disable(); 

component.$enable(); // restarts in background...  
component.$disable(); // ... abort and disable 
await wait(1000); // interval and requests are disabled

await component.$uninstall(); // remove all, including css, dom, timers, requests... 
```

Components can be created from an Object Literal, using the shortcut [`jFactory()`](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-components.md#create-a-component-literal), or
alternatively, any Class can be extended dynamically into a Component using [JFactoryTraits](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-components.md#create-a-component-base-class).  

## Patterns

- Registry:<img align="right" src="https://github.com/jfactory-es/jfactory/blob/master/doc/img/pic1.png"> all component subscriptions (listeners, promises, timers, fetch, dom...) are explorable in a registry, allowing quick visual inspections in DevTools.

- [Tasks](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitTask.md): asynchronous processes can be registered as expirable tasks that block the current Service State Change, guaranteeing that everything is resolved before completing it, including all subpromises. 

- [Remove Phase](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitService-Phases.md#remove-phase): jFactory will automatically stop and remove the subscriptions (listeners, promises, timers, fetch, dom...) registered during an opposite state change (install/uninstall, enable/disable)

- [Promise Chains](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md): jFactory uses extended native Promises that makes the whole Chain[ Awaitable](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md#chain-awaitable), [Completable](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md#chain-completion--cancellation), [Cancelable](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md#chain-completion--cancellation) and [Expirable](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md#chain-expiration).

- [Traits](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-components.md#create-a-component-base-class): Components are Objects created from Classes dynamically extended by JFactoryTraits. 

- Debug: jFactory is designed for asynchronous component-based application development, using contextual loggers and subloggers,
 filterable source-mapped stack traces, identifiers, loggable extended errors, explorable promise chains, ...

     
## Internal Framework   

jFactory is entirely designed from importable ES6+ Classes that provides theses features: 

- [Extended Promise](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md)
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
[![Node CI](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)](#implementation)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/jfactory-es.svg)](#implementation)
[![vulnerabilities](https://img.shields.io/github/issues/jfactory-es/jfactory.svg?style=flat)](#implementation)


- **Beta**. <!-- The specifications are still subject to changes.--> Feel free to submit your suggestions.
- External Dependencies: jQuery, Lodash (may be removed in next releases)

## Contributing

Thank you to everyone who takes the time to share their comments, bug reports and fixes. If you have any questions, feel free to create an [issue](https://github.com/jfactory-es/jfactory/issues). 

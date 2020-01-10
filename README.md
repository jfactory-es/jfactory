# jFactory
A component-based architecture for asynchronous Web applications. Designed to automate component shutdown cleanups of promise chains, listeners, requests, DOMs, etc. 

```shell script
npm add jfactory-es
```

* [Documentation](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-index.md) / [Traits](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-index.md#traits-component-features) / [Classes](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-index.md#classes-internal-library)
* [Installation & Dependencies](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-import.md)
* [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

## Abstract

jFactory easily compartmentalize your application into components that can:

- operate like services (install, enable, disable, uninstall) 
- automatically ensure all promise chains and subtrees are completed at service state change
- automatically switch off subscribed listeners, timers, requests, promises, <!--callbacks, -->dom, css... 
- automatically prevent all expired asynchronous calls (<!--callbacks, -->promise subtrees, event handlers...) 
- keep track in DevTools of all running subscriptions (listeners, timers, requests, promises, dom, css...)
- improve the Promise chains (Awaitable, Completable, Cancelable and Expirable) 

## Overview

In a nutshell, jFactory provides methods to register listeners, dom, css, fetch and asynchronous tasks that will be automatically stopped (including subpromise trees) and removed at oposite service state change. 



 jFactory ensures that before resolving a [Service State Change](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitService-Phases.md), all asynchronous actions of the associated [Service Handler](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitService-States.md#service-state-handlers) are completed, including subpromises. 
```javascript
import { jFactory } from "jfactory-es"

let component = jFactory("whatsNewComponent", {
  onInstall() {
    this.$cssFetch("#whatsnew-css", "asset.css");
    this.$domFetch("#whatsnew-div", "asset.html")
      .then(dom => dom.appendTo("body"));
    this.$task("watsNew-init", new Promise(resolve => wait(500).then(resolve)))
      .then(() => this.$log('init sub task done.'))
  },

  onEnable() {
    let count = 0;
    this.$on("pointerdown", "#whatsnew-div", () => this.$log('click!'));
    this.$interval("updateNews", 250, () =>
      this.$fetchJSON("getNews", "asset.json")
        .then(() => this.$log("updated", ++count))
    )
  }
});

await component.$install(); 
await component.$enable();
await wait(1000);
// stops/removes everything started
// during and after onEnable()
await component.$disable(); 
component.$enable(); // restart in background... 
component.$disable(); // ... abort and disable
await wait(1000);
await component.$uninstall(); 
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

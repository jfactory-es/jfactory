# jFactory
A component-based architecture for asynchronous applications in JavaScript ES6+. 

```shell script
npm add jfactory-es
```

* [Documentation](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-index.md) / [Traits](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-index.md#traits-component-features) / [Classes](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-index.md#classes-internal-library)
* [Installation & Dependencies](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-import.md)
* [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

## Abstract

jFactory easily compartmentalize your application into components that can:

- operate like phased services (install/enable/disable/uninstall) 
- ensure all promise chains are completed when awaiting a service phase change
- contextually switch off all subscribed listeners, timers, requests, promises, <!--callbacks, -->dom, css... 
- automatically prevent all expired asynchronous calls (<!--callbacks, -->promise chains, event handlers...) 
- keep track of all running subscriptions (listeners, timers, requests, promises, dom, css...)
- provide observable and expirable trees of Promises
- significantly improve debugging of asynchronous applications 

## Overview

In a nutshell, jFactory provides methods to register listeners, dom, css, fetch and asynchronous tasks that will be automatically stopped (including subpromise trees) and removed at oposite service state change. 

Any Classes can be dynamically extended to a Component using [JFactoryTraits](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-components.md#create-a-component-base-class).  
Alternatively, Components can also be created from an Object Literal, using the shortcut [`jFactory()`](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-components.md#create-a-component-literal)

```javascript
import { jFactory } from "jfactory"

let component = jFactory("WhatsNewComponent", {
  onInstall() {
    this.$cssFetch("#whatsnew-css", "asset.css");
    this.$domFetch("#whatsnew-div", "asset.html")
      .then(dom => dom.hide().appendTo("body")) // jQuery
  },

  onEnable() {
    this.$on("click", "#whatsnew", ".button", () => this.$log("click!"));
    this.$fetchText("news", "whatsnew.html")
      .then(html => $("#whatsnew").html(html).show()) // jQuery
  },

  onDisable() {$("#panel").hide()}, // jQuery

  // -- custom methods ---

  async somethingAsync() {
    this.$fetchJSON("myLoader", "asset.json")
      .then(data => this.$log("data:", data));
    this.$task("myTask1", Promise.resolve(123))
      .then(() => this.$log("done1"));
    this.$task("myTask2", async resolve => setTimeout(resolve, 0))
      .then(() => this.$log("done2"))
  }
});

(async function() {
  await component.$install(true); // await everything in onInstall, then await everything in onEnable()
  component.somethingAsync(); // start async tasks in background
  await component.$disable(); // stop/remove everything started during and after $enable()
  await component.$enable(); // await everything in onEnable()
  component.somethingAsync(); // start async tasks in background
  await component.$uninstall(); // stop/remove all
}());
```
 jFactory ensures that before resolving a [Service State Change](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitService-Phases.md), all Tasks of its [Service Handler](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitService-States.md#service-state-handlers) are completed, including subpromise trees. 

## Patterns

- Registry:<img align="right" src="https://github.com/jfactory-es/jfactory/blob/master/doc/img/pic1.png"> all component subscriptions (listeners, promises, timers, fetch, dom...) are explorable in a registry, allowing quick visual inspections in DevTools.

- [Tasks](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitTask.md): asynchronous processes can be registered as expirable tasks that block the current Service State Change, guaranteeing that everything is resolved before completing it, including all subpromises. 

- [Remove Phase](https://github.com/jfactory-es/jfactory/blob/master/doc/TraitService-Phases.md#remove-phase): jFactory will automatically stop and remove the subscriptions (listeners, promises, timers, fetch, dom...) registered during an opposite phase (install/uninstall, enable/disable)

- [Traits](https://github.com/jfactory-es/jfactory/blob/master/doc/ref-components.md#create-a-component-base-class): Components are Objects created from Classes dynamically extended by JFactoryTraits. 

- [Promise Chains](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md): jFactory uses extended native Promises that makes the whole Chain[ Awaitable](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md#chain-awaitable), [Completable](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md#chain-completion--cancellation), [Cancelable](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md#chain-completion--cancellation) and [Expirable](https://github.com/jfactory-es/jfactory/blob/master/doc/JFactoryPromise.md#chain-expiration).

- Debug: jFactory is designed for asynchronous component-based application development, using contextual loggers and subloggers,
 filterable source-mapped stack traces, named objects, loggable extended errors, explorable promise chains, ...

     
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
[![npm version](https://img.shields.io/npm/v/jfactory-es.svg?style=flat)](https://www.npmjs.com/package/jfactory-es)  [![GitHub version](https://img.shields.io/github/package-json/v/jfactory-es/jfactory.svg?style=flat)](https://github.com/jfactory-es/jfactory) ![](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)

/github/package-json/v/:user/:repo

- **Beta**. The specifications are still subject to changes. Feel free to submit your suggestions.
- External Dependencies: jQuery, Lodash (may be removed in next releases)

## Contributing

If you have any questions, feel free to create an [issue](https://github.com/jfactory-es/jfactory/issues). Thank you to everyone who takes the time to share their comments, bug reports and fixes.

[jFactory](index.md) > [Reference](ref-index.md) > [Trait](ref-index.md#traits-component-features) > [TraitService](TraitService.md) > Service States  

# Service States

Components define two Service [States](TraitState.md): `installed` and `enabled`. \
They are controlled by the [Switchers](#service-state-switchers): `$install()`, `$enable()`, `$disable()`, `$uninstall()`. \
The internal task associated to a Service State Change is called a ["Phase"](TraitService-Phases.md). \
Each Phase calls its own optional [Service State Handler](#service-state-handlers) where you can define asynchronous behaviors.

* [State installed vs enabled](#state-installed-vs-enabled)
* [Service State Switchers](#service-state-switchers)
* [Service State Handlers](#service-state-handlers)
* [Service State Events](#service-state-events)

### State installed vs enabled

You can install without enabling. You can disable without uninstalling.\
You usually install once, and enable/disable several times.

Typically, the `PHASE_INSTALL` is intended for preloading component data and installing things only once (loading css, create dom containers, initialize storage, etc) while the `PHASE_ENABLE` activate background tasks by registering event listeners, unhide dom, etc. It depends on what you want to [automatically stop and remove](TraitService-Phases.md#remove-phase) when calling `$disable()` and restart when calling `$enable()`. 

### Service State Switchers

It's suggested to use these switchers with `await` to prevent side effects. See also [Switching Synchronously](#switching-synchronously).

```javascript
await myComponent.$install();
await myComponent.$enable();
await myComponent.$disable();
await myComponent.$uninstall();
```
#### Shortcuts

`$install(true)` is a shortcut of  `await $install()` then `await $enable()`. \
`$uninstall()` implicitly calls `await $disable()` before uninstalling.

#### Switching Synchronously

>**It is strongly discouraged to use the switchers synchronously, as you may invalidate the following conditions by upgrading your project, causing side effects.** 

The [Service State Switchers](#service-state-switchers) can be called synchronously without await, if all these conditions are met:
- You can predict that all Tasks will be removed after the [step 1 of the Phase process](TraitService-Phases.md#phase-process-and-resolving).   
- The service State Handler is synchronous, doesn't return a promise and doesn't initiate Tasks.
  
Debug tip: If these conditions are met, the switcher will return a resolved JFactoryPromiseSync, with a property $isSettled = true; 

### Service State Handlers

Service State Handlers are optional component handlers called on [Service State Changes](TraitService-Phases.md). 
They can be asynchronous (async function or returns a promise). 

**Important**: Keep in mind that the asynchronous methods of jFactory may register [Tasks](TraitTask.md), defering the end of the Service State Handler until all subpromises are resolved. See [Phase process and resolving](TraitService-Phases.md#phase-process-and-resolving). 
 
Supported Service State Handlers:
 
```javascript
import { jFactory } from "jfactory";

let myComponent = jFactory('myComponent', {
    onInstall() {
        this.$log('installing')
    }, 
    onEnable() {
        this.$log('enabling')
    }, 
    onDisable() {
        this.$log('disabling')    
    },  
    onUninstall() {
        this.$log('uninstalling')    
    }
});

myComponent.$install(true); // shortcut for install() then enable()
myComponent.$uninstall();
```

### Service State Events

You shouldn't need this, but additionally to the Service State Handlers, observable State Events are fired when states are changed. However, keep in mind that the `$on()` event observer (like most of other jFactory methods) cannot be called if the component is not `enabled`, except during PHASE_INSTALL or PHASE_ENABLE. So you cannot listen to the install event that way.
                    
```javascript
import { jFactory } from "jfactory";

let myComponent = jFactory('myComponent', {
    onInstall() {
        this.$on("beforeStateChange", (jQueryEvent, eventData) => {
            this.$log(jQueryEvent.type, eventData.key, eventData.previousVal+' => '+eventData.val)
        });
        this.$on("afterStateChange", (jQueryEvent, eventData) => {
            this.$log(jQueryEvent.type, eventData.key, eventData.previousVal+' => '+eventData.val)
        });
        this.$on("enable", (jQueryEvent) => {
            this.$log(jQueryEvent.type)
        });
        this.$on("disable", (jQueryEvent) => {
            this.$log(jQueryEvent.type)
        });
        this.$on("install", (jQueryEvent) => {
            this.$log(jQueryEvent.type) // never called, already inside onInstall handler
        });
        this.$on("uninstall", (jQueryEvent) => {
            this.$log(jQueryEvent.type)
        });
    }
});

myComponent.$install(true);
myComponent.$uninstall();
```

Result:
```text
myComponent> beforeStateChange enabled false => true
myComponent> afterStateChange enabled false => true
myComponent> enable
myComponent> beforeStateChange enabled true => false
myComponent> afterStateChange enabled true => false
myComponent> disable
myComponent> beforeStateChange installed true => false
myComponent> afterStateChange installed true => false
myComponent> uninstall
```                    
---
See also:
* [Service Phase](TraitService-Phases.md)
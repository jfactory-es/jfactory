[jFactory](index.md) > [Reference](ref-index.md) > [Trait](ref-index.md#traits-component-features) > [TraitService](TraitService.md) > Service Phases  

# Service Phases

Changing the [Service State](TraitService-States.md) creates an awaitable internal process called a "Phase".

* Init Phases: `PHASE_INSTALL`, `PHASE_ENABLE`  
* Remove Phases: `PHASE_UNINSTALL` `PHASE_DISABLE`  

Phase changes of the same group (Init or Remove) are queued, but starting an opposite Phase aborts the current one.

Phases are controlled by the [Service State Switchers](TraitService-States.md#service-state-switchers).

```javascript
await myComponent.$enable(); // wait until PHASE_ENABLE is completed
```

### Remove Phase

All subscriptions to the `$` registry (listeners, promises, timers, fetch, dom...) are automatically stopped and/or removed during the Remove Phase, according to this pattern:

* Everything registered during `PHASE_INSTALL` will be removed during `PHASE_UNINSTALL`
* Everything registered during `PHASE_ENABLE` will be removed during `PHASE_DISABLE`
* Everything registered when state `enabled` is true will be removed during `PHASE_DISABLE` 

There is no other case because you are not allowed to call most of the methods of jFactory if the component is not enabled.

### Phase process and resolving 

When a new Phase starts, it runs this pattern:

1) It synchronously stops and removes the [Tasks](TraitTask.md) registered in `myComponent.$.tasks`, only if their [Remove Phase](TraitService-Phases.md#remove-phase) match the new Phase. 
1) If declared, it runs and awaits the corresponding [Service State Handler](TraitService-States.md#service-state-handlers).
1) It awaits any registered Tasks.
1) The Phase is resolved.

**Consequence: A Phase only ends after all the Tasks and their subpromises created by the current Service State Handler are resolved:** 

```javascript
let component = jFactory("myComponent", {
    onInstall() { // service state handler called at PHASE_INSTALL 
        this.$cssFetch("css", "stylesheet.css")
            .then(() => 
                this.$timeout("wait", 10000)
                    .then(()=>this.$log("ok"))
            )
    }
});

await component.$install();
// => await until the whole promise chain is resolved, including the timer 
```
---
See also:
* [Service States](TraitService-States.md)
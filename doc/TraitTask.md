[jFactory](../README.md) > [Reference](ref-index.md) > [Traits](ref-index.md#traits-component-features) > TraitTask

# TraitTask

[Registry](#registry) / [Methods](#injected-methods) / [Usages](#usages)

Registers Promises wrapped by [`JFactoryPromise`](JFactoryPromise.md) objects that will be expired and removed at [Remove Phase](TraitService-Phases.md#remove-phase). 

## Behavior

* During a [Phase Change](TraitService-Phases.md), `$taskRemoveAll(<New Phase>)` is called, which stops and removes all Tasks with a [Remove Phase](TraitService-Phases.md#remove-phase) equal to the new [Phase](TraitService-Phases.md).

* Before completing, a Phase awaits the [Completion](JFactoryPromise.md#chain-completion--cancellation) of all the Tasks registered in `myComponent.$.tasks`, including promises registered during the current [Service State Handler](TraitService-States.md#service-state-handlers).

* The jFactory methods create Tasks when they operate asynchronously.

See also [`JFactoryPromise`](JFactoryPromise.md), [`TraitService`](TraitService-Phases.md#phase-process-and-resolving) 

## Registry

`myComponent.$.tasks`

## Injected Methods

### `$task(registryId {string}, executorOrValue {Promise | function | *})`
Returns: [`JFactoryPromise`](JFactoryPromise.md)  

>**Defers current Phase**: This method registers a Task that blocks the resolution of the current Phase (if any) until the whole Task chain (including subpromises) is resolved.

>**Auto completed**: The promise chain is completed and expired as soon as all subpromises are resolved. This behavior can be disabled by setting `anyPromiseOfTheChain.$chain.chainConfig.chainAutoComplete = false` before the promise chain is completed.

> **Auto removed**: This Subscription is removed as soon as its Promise Chain is completed.

* Passing an existing Promise or Thenable:
```javascript
 myComponent.$task('myPromise', promise) 
    .then(() => "ok")
```
* Passing a Promise Executor (promise creation)
```javascript
 myComponent.$task('myPromise', (resolve, reject) => setTimeout(resolve, 1000))
    .then(() => "ok")
```
* Passing a Value (creates a resolved promise)
```javascript
 myComponent.$task('myPromise', 41)
    .then(value => value + 1)
```
### `$taskRemove(registryId {string}, reason {string} = "$taskRemove()")`
>
>Expires and removes the promise registered with the key `registryId` previously created by `$task()`. An optional reason can be given for debugging the expired Promise Chain.
>

### `$taskRemoveAll(phase)`
>*(Automatically called at [Remove Phase](TraitService-Phases.md#remove-phase))*
>
>Removes any promise previously created by `$task()` if their [Remove Phase](TraitService-Phases.md#remove-phase) match the given `phase`.

<!--
### `$taskPromiseAll(autoComplete)`
>
>
>
-->

## Usages
<!--
```javascript
import {jFactory} from "jfactory-es";

let myComponent = jFactory("myComponent", {
    onInstall() {
         this.installPromise = this.$task("installPromise", resolve => setTimeout(resolve, 100));

        this.$log(
            "install promise:",
            "fulfilled:", this.installPromise.$isFulfilled,  // false
            "settled:", this.installPromise.$isSettled)  // false
    },

    onEnable() {
        this.enablePromise = this.$task("enablePromise", resolve => setTimeout(resolve, 10));

        this.$log(
            "enable promise:",
            "fulfilled:", this.enablePromise.$isFulfilled,  // false
            "settled:", this.enablePromise.$isSettled)  // false
    }
});

await myComponent.$install();
myComponent.$log(
        "install promise:",
        "fulfilled:", myComponent.installPromise.$isFulfilled, // true
        "settled:", myComponent.installPromise.$isSettled); // true

await myComponent.$enable();
myComponent.$log(
    "enable promise:",
    "fulfilled:", myComponent.enablePromise.$isFulfilled, // true
    "settled:", myComponent.enablePromise.$isSettled); // true

// Service State "enabled" is true so 
// the [Remove Phase](TraitService-Phases.md#remove-phase) will be PHASE_DISABLE for this promise:
myComponent.$task("myPromise", resolve => setTimeout(resolve, 10))
    .then(()=>myComponent.$log("hello?")); // not called because a $disable() is called below

// remove and expires pending promises that expire at PHASE_DISABLE
myComponent.$disable();
```
-->
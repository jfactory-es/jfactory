[jFactory](index.md) > [Reference](ref-index.md) > [Traits](ref-index.md#traits-component-features) > TraitTimeout

# TraitTimeout

[Registry](#registry) / [Methods](#injected-methods) / [Usages](#usages)

Registers timeouts that will be automatically stopped and removed at [Remove Phase](TraitService-Phases.md#remove-phase). The timeouts are wrapped by [`JFactoryPromise`](JFactoryPromise.md)  which makes them awaitable, thenable and expirable.

## Registry

`myComponent.$.timeouts`

## Injected Methods

### `$timeout(registryId {string}, delay {number} [, callback {function}, [, ...handlerArguments]])` 
Returns: [`JFactoryPromise`](JFactoryPromise.md)  

>**Defers current Phase**: This method registers a Task that blocks the resolution of the current Phase (if any) until the whole Task chain (including subpromises) is resolved.

>**Auto completed**: The promise chain is completed and expired as soon as all subpromises are resolved. This behavior can be disabled by setting `anyPromiseOfTheChain.$chain.chainConfig.chainAutoComplete = false` before the promise chain is completed.

>**Auto removed**: This Subscription is removed as soon as its Promise Chain is completed.

* Promise syntax:

   ```javascript
   myComponent.$timeout("myTimeout", 1000)
      .then(() => myComponent.$log("ready"))   
   ```  
   ```javascript
   await myComponent.$timeout("myTimeout2", 1000);
   myComponent.$log("ready")
   ```  
* With callback and arguments

   ```javascript
   myComponent.$timeout("myTimeout", 1000, (arg1, arg2) => {}, "myArg1", "myArg2")
      .then(() => myComponent.$log("ready"))
   ```  
### `$timeoutRemove(registryId {string} [, reason {string} = "$timeoutRemove()"])` 

Expires and removes the timeout registered with the key `registryId` previously created by `$timeout()`. An optional `reason` can be given for debugging the expired Promise Chain. 

### `$timeoutRemoveAll(removePhase)` 

*(Automatically called at [Remove Phase](TraitService-Phases.md#remove-phase))*

Expires and removes any timer previously created by `$timeout()` if their [Remove Phase](TraitService-Phases.md#remove-phase) match the given `removePhase`.
 
## Usages
<!--
```javascript
import { jFactory } from "jfactory";

let myComponent = jFactory("myComponent", {
    onInstall() {
        this.counter = 0;
        this.$timeout("installTimer", () => this.counter++, 100)
    },
    onEnable() {
        this.$log('counter after installing =', this.counter); // = 1
        this.$timeout("enableTimer", () => this.counter++, 10)
            .then(
                () => this.$log('counter after enabling =', this.counter) // = 2
            )
    }
});

await myComponent.$install(true);
```
-->
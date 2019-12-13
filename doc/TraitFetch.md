[jFactory](../README.md) > [Reference](ref-index.md) > [Traits](ref-index.md#traits-component-features) > TraitFetch

# TraitFetch

[Registry](#registry) / [Methods](#injected-methods) / [Usages](#usages)


Registers [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API) requests that will be automatically stopped and removed at [Remove Phase](TraitService-Phases.md#remove-phase).
This uses [`JFactoryFetch`](JFactoryFetch.md) which inherits from [`JFactoryPromise`](JFactoryPromise.md), allowing [Request Cancellation](JFactoryPromise.md#chain-completion--cancellation) and [Promise Chain Expiration](JFactoryPromise.md#chain-expiration).  

## Registry
`myComponent.$.requests`

## Injected Methods

### `$fetch(registryId {string}, url {string}, fetchOptions {object})`
Returns: [`JFactoryFetch`](JFactoryFetch.md) resolved with the [Fetch Response](https://developer.mozilla.org/docs/Web/API/Response).   
See also [`$fetchText()`](#fetchtextregistryid-string-url-string-fetchoptions-object) and [`$fetchJSON()`](#fetchjsonregistryid-string-url-string-fetchoptions-object)

>**Defers current Phase**: This method registers a Task that blocks the resolution of the current Phase (if any) until the whole Task chain (including subpromises) is resolved.

>**Auto completed**: The promise chain is completed and expired as soon as all subpromises are resolved. This behavior can be disabled by setting `anyPromiseOfTheChain.$chain.chainConfig.chainAutoComplete = false` before the promise chain is completed.

> **Auto removed**: This Subscription is removed as soon as its Promise Chain is completed.

```javascript
myComponent.$fetch("myFetch", "asset.html", {
    cache : 'no-cache'
})
    .then(fetchResponse => {})
```
### `$fetchText(registryId {string}, url {string}, fetchOptions {object})`
Returns: `String`

Same as `$fetch()` but resolved as String.

### `$fetchJSON(registryId {string}, url {string}, fetchOptions {object})`
Returns: `Object`

Same as `$fetch()` but resolved as JSON Object.

### `$fetchRemove(registryId {string}, reason {string} = "$fetchRemove()")`

Expires and removes the fetch registered with the key `registryId` previously created by `$fetch()`. An optional reason can be given for debugging the aborted Promise Chain.

### `$fetchRemoveAll(removePhase)`

*(Automatically called at [Remove Phase](TraitService-Phases.md#remove-phase))*

Expires and removes any [`JFactoryFetch`](JFactoryFetch.md) previously created by `$fetch()` if their [Remove Phase](TraitService-Phases.md#remove-phase) match the given `removePhase`.
 
## Usages
<!--
#### 1. $fetch.then()

This example shows how jFactory synchronize Tasks (including requests) and there promise chains between install() and enable();
 
```javascript
let myComponent = jFactory("myComponent", {
    onInstall() {
        // theses requests are loaded in parallel
        // the onInstall handler is resolved when all its Tasks are completed
        this.$fetchJSON("data1", asset.json, {cache: 'no-cache'})
            .then(r => this.json = r);
        this.$fetchText("data2", asset.json, {cache: 'no-cache'})
            .then(r => this.text = r);
        this.$fetch("data3", asset.json, {cache: 'no-cache'})
            .then(r => this.fetchResponse = r);
    },
    onEnable() {
        // "await $install()" guarantees that all its Tasks and sub promises are completed
        // so the results are available here:
        this.$log("loaded as json:", this.json);
        this.$log("loaded as text:", this.text);
        this.$log("loaded as fetch response:", this.fetchResponse);
    },
});

await myComponent.$install(true); // install+enable
```
####2. await $fetch()

If you don't like to use "then()", and prefer to use await, 
be careful to parallelize the Tasks to maximize the performances. 

```javascript
let myComponent = jFactory("myComponent", {
    async onInstall() {
        // start all the Tasks in parallel before using await
        let task1 = this.$fetchJSON("data1", asset.json, {cache: 'no-cache'});
        let task2 = this.$fetchText("data2", asset.json, {cache: 'no-cache'});
        let task3 = this.$fetch("data3", asset.json, {cache: 'no-cache'});

        // assign the results 
        this.json = await task1;
        this.text = await task2;
        this.fetchResponse = await task3;
    },
    onEnable() {
        this.$log("loaded as json:", this.json);
        this.$log("loaded as text:", this.text);
        this.$log("loaded as fetch response:", this.fetchResponse);
    },
});

await myComponent.$install(true); // install+enable
```
-->
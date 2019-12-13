[jFactory](../README.md) > [Reference](ref-index.md) > [Classes](ref-index.md#classes-internal-library) > JFactoryPromise

# JFactoryPromise 

[Properties](#properties) / [Methods](#methods) / [Options](#options) / [Usages](#usages)

Provides an extended Promise that supports an awaitable and expirable promise tree, status, explorable chain map, shared data, debug data and trace.

```javascript
import {JFactoryPromise} from "jfactory-es" 
``` 
* [Status](#promise-status)
* [Chain](#promise-chain)
* [Chain Completion](#chain-completion--cancellation)
* [Chain Cancellation](#chain-completion--cancellation)
* [Chain Expiration](#chain-expiration)
* [Chain Awaitable](#chain-awaitable)
* [Shared Properties](#shared-properties)

***
**Note:** This library is experimental. Feel free to make suggestions.
***

## Promise Status

#### $isExpired
>Type: `boolean` Default: `false`
>
>Becomes `true` if the promise has expired.
>
>See also [Chain Expiration](#chain-expiration).

#### $isFulfilled
>Type: `boolean` Default: `false`
>
>Becomes `true` if the promise is successfully completed (not rejected).

#### $isRejected 
>Type: `boolean` Default: `false`
>
>Becomes `true` if the promise is rejected.
   
#### $isSettled
>Type: `boolean` Default: `false`
>
>Becomes `true` if the promise is not pending anymore. 

#### $value
>Type: `*` Default: `undefined`
>
>The resolved value of the promise.

## Properties

In addition to the [Promise Status](#promise-status):


#### $dev_name (developer mode)
>The optional name given at instantiation to identify the promise. See [Usage 2](#2-instantiation-with-optional-arguments). 

#### $dev_onFulfilled (developer mode)
>The onFulfilled() handler registered for this promise. (Read-only).

#### $dev_onRejected (developer mode)
>The onRejected() handler registered for this promise (Read-only).

#### $dev_path (developer mode)
>The path of promises, as an ordered list, to reach the current promise. Also provides a property `printable` that returns the path as a string.

#### $dev_source (developer mode)
>The function used to create the promise (Read-only). Only available for the first promise of the chain.

#### $dev_traceLog (developer mode)
>A getter that prints a log in the console to trace the origin of the promise.

#### $dev_traceSource (developer mode)
>The trace source used by $dev_traceLog.

#### $dev_position (developer mode)
>The index of this promise in myPromise.$.chain.chainMap.

#### $type
>Type: `string`
>
>The method used to create the promise.
>Can be `then` `await` `catch` `catchExpired` or `promise` 

### Shared Properties

When using then() or catch(), the enumerable properties of the promise are copied to the new subpromise.
This is useful to inherit methods and share objects through the chain, 
but keep in mind that enumerable primitives properties will be copied by value, not by reference.  
 
#### $chain (shared)
>Type: `object`
>
>The [Promise Chain Manager](#promise-chain) shared by all promises of the chain.     

## Methods 

### `$chainAbort([reason = "$chainAbort()"])`
>Returns: `this (JFactoryPromise)`
>
>An alias of `$chainComplete()` used in an 
>interruption context to [Complete](#chain-completion--cancellation) the chain and [Expire](#chain-expiration) all the promises before the end.
>
>```js
>promise.$chainAbort("aborted by user");
>
>await promise.$chain; // resolved by $chainAbort() 
>```

### `$chainComplete([reason = "$chainComplete()"])`
>Returns: `this (JFactoryPromise)`
>
>Manually [Completes](#chain-completion--cancellation) the chain and [Expires](#chain-expiration) all the promises of the chain.  
>You don't need to use this method if you are not [awaiting the whole Chain](#chain-awaitable).  
>
>```js
>promise.$chainComplete("chain completed as expected");
>
>await promise.$chain; // resolved by $chainComplete()  
>```
>
>#### Optional Arguments
>* `reason`  
>An optional `reason` passed to the Expiration Error.

### `$chainAutoComplete()`
>Returns: `this (JFactoryPromise)`
>
>**Caution**: [See AutoComplete Restrictions](#autocomplete-restriction).
>
>Automatically [Completes](#chain-completion--cancellation) the chain as soon as all its promises are fulfilled.  
>You don't need to use this method if you are not [awaiting the whole chain](#chain-awaitable).  
>A completed chain is also fully [Expired](#chain-expiration).
>
>Note: It's a shortcut that sets `myPromise.$chain.chainConfig.chainAutoComplete` to `true`.  

### `$catchExpired(onAbort)`
>Returns: `this (JFactoryPromise)`
>
>Call the `onAbort()` when trying to await the chain after expiration.
>
>```js
>let promise = JFactoryPromise.resolve()
>   .then(()=>{})
>   .$catchExpired(reason => {
>       console.log('expired', reason)
>   });
>
>promise.$chainAbort("aborted!");
>await promise; 
>```

### `$toPromise()`
> Returns: `Promise`
>
>Convert the JFactoryPromise to a native Promise.

### `static JFactoryPromise.resolve([options][, value])`
> Returns `JFactoryPromise`
>
>Similar to [Promise.resolve()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve) but returns a JFactoryPromise.
>```javascript
>JFactoryPromise.resolve();
>JFactoryPromise.resolve(123);
>JFactoryPromise.resolve(promise);
>JFactoryPromise.resolve({name: "myPromise", config: {
>    chainAutoComplete: true
>}}, 123);

### `static JFactoryPromise.reject([options][, reason])`
> Returns `JFactoryPromise`
>
>Similar to [Promise.reject()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject) but returns a JFactoryPromise.
>```javascript
>JFactoryPromise.reject();
>JFactoryPromise.reject("error");
>JFactoryPromise.reject({name: "myPromise", config: {
>    chainAutoComplete: true
>}}, new Error("..."));
>```

## Options

The options of a JFactoryPromise are stored in `myPromise.$chain.chainConfig`. Note that `$chain` is a property shared by all the promises of the chain. Options can be changed at any time and/or passed as argument to the constructor, see [Usage 2](#2-instantiation-with-optional-arguments)

### `chainAutoComplete` (false)
>When set to true, starts the chain [AutoComplete Watcher](#autocomplete-watcher).  
>The shortcut [`$chainAutoComplete()`](#chainautocomplete) set this value to true. 
>
>**Caution**: [See AutoComplete Restrictions](#autocomplete-restriction)

## Promise Chain

In jFactory, the whole promise tree (the initial promise and its subpromises, including all subbranches), is called a **Promise Chain**. 

The promise chain is managed by `myPromise.$chain`, an Object shared by all the promises of the promise tree. 
It provides the possibility to make the [whole chain awaitable for completion](#chain-awaitable). 

### Why 

A Promise Chain can be a tree. In this case, running the handler of the last then() doesn't guarantee that all promises are settled.

```js
let p0 = new Promise(resolve=>resolve(0));
let p1 = p0.then(v=>v+1); // new promise, p1 from p0 (chained)
let p2 = p0.then(v=>v+1); // new promise, p2 from p0 (new branch)

await p2 // = 1, not 2
```
When the `onFulfilled()` handlers of p1 and p2 are unpredictably asynchronous, 
there is no simple way to determine if they are all settled, unless you store the promises and call a Promise.allSettled().
In the case of a tree with many subbranches, it becomes complicated. That's why JFactoryPromise provides an [Awaitable Chain Manager](#chain-awaitable) that automatically stores all the subpromises.
 
### Chain Properties

`myPromise.$chain.*`

#### chainMap
>All the promises of the Promise Chain are recorded into `myPromise.$chain.chainMap`.
>This is rather an internal object, but it can be useful to inspect it as it immediately shows what promise is blocking the chain completion, through a Boolean value reflecting the `$isFulfilled` property.

#### chainRoot
>The promise that initiated the chain.

#### isPending
>True if the chain contains a pending promise. 

#### isCompleted
>True if the chain is explicitly [marked as completed](#chain-completion--cancellation).

## Chain Completion / Cancellation

By definition, a Promise Chain is Completed when all its subpromises are settled (fulfilled or rejected), or when the chain is aborted.  
You don't need to (auto)Complete the chain if you are not [awaiting the whole chain](#chain-awaitable).

Completing a chain has these side effects: 
* All the promises of the chain are [expired](#chain-expiration).  
* The thenable `myPromise.$chain` is [resolved](#chain-awaitable).

The chain can be completed by two ways:
* manually, by calling [`$chainAbort()`](#chainabortreason--chainabort) or [`$chainComplete()`](#chaincompletereason--chaincomplete).
* automatically, by using the [AutoComplete Watcher](#autocomplete-watcher).

### AutoComplete watcher

When enabled, the watcher completes the chain as soon as all the promises of a the chain are settled (resolved or rejected).  

The AutoComplete can be enabled by tow ways:
* by calling [`myPromise.$chainAutoComplete()`](#chainautocomplete)
* by setting the config value `myPromise.$chain.chainConfig.chainAutoComplete` to `true`.

>#### AutoComplete Restriction
>
>Make sure to create the whole chain (using `then()` or `catch()`) before enabling the AutoComplete, 
because the chain is completed as soon as all its registered promises are settled. In other words, a chain can AutoComplete in background during any "await".
>In this case, any new then() will result to an expired promise call.

## Chain Expiration

When a chain is [Completed](#chain-completion--cancellation), all the (new and old) promises of the chain are expired:   
* All handlers installed by `then()` and `catch()` are ignored.
* The following [`$catchExpired()`](#catchexpiredonabort) handlers will be called.

## Chain Awaitable 

The whole [Promise Chain](#promise-chain) can be awaited through the property `$chain`
 and resolved synchronously when the chain is [marked as Completed](#chain-completion--cancellation): 

`await myPromise.$chain`

## Usages

#### 1. Instantiation (classic)
```js
let myPromise = new JFactoryPromise((resolve, reject) => {
    resolve('ok')
});

JFactoryPromise.resolve();
JFactoryPromise.resolve(123);
JFactoryPromise.resolve(promise);
JFactoryPromise.reject();
JFactoryPromise.reject(123);
```

#### 2. Instantiation (with optional arguments)
This advanced syntax allows you to define a name, and override the default configuration. 
```js
let options = {
    name: "myPromise",
    config: {
        chainAutoComplete: true
    }
};

let myPromise = new JFactoryPromise(options, (resolve, reject) => {
    resolve('ok')
});

JFactoryPromise.resolve(options, 123);
JFactoryPromise.reject(options, 123);

// To specify options without value/reason:
JFactoryPromise.resolve(options, undefined);
JFactoryPromise.reject(options, undefined);
```

#### 3. Automatically Completed - `$chainAutoComplete()`

Await a chain composed of two branches of two unpredictable asynchronous then().  
 
```js
let handlerCalled = 0;

// ---helper
let doSomethingAsync = function (name) {
    console.log("called:", name);
    handlerCalled++;
    // block the handler by returning an unpredictable pending promise:
    return new Promise(function (resolve){
        setTimeout(resolve, Math.random()*50)
    });
};
// ---

let promiseRoot = JFactoryPromise.resolve();

// Branch A
promiseRoot
    .then(r => doSomethingAsync('A1'))
    .then(r => doSomethingAsync('A2'));

// Branch B
promiseRoot
    .then(r => doSomethingAsync('B1'))
    .then(r => doSomethingAsync('B2'));

promiseRoot.$chainAutoComplete(); // can be called from any promise of the chain

await promiseRoot.$chain;
console.log("Chain completed; handlerCalled =", handlerCalled); // 4
```

#### 4. Manual Completion - `$chainComplete()`

Manually completes the chain by calling `$chainComplete()` in the last then().
Should only be reliable for vertically chained promises (not with multibranch chains. See example 5). 

```javascript
let handlerCalled = 0;

// ---helper
let doSomethingAsync = function (name) {
    console.log("called:", name);
    handlerCalled++;
    // block the handler by returning a unpredictable pending promise:
    return new Promise(function (resolve){
        setTimeout(resolve, Math.random()*50)
    });
};
// ---

let promiseRoot = JFactoryPromise.resolve()
    .then(r => doSomethingAsync('A1'))
    .then(r => doSomethingAsync('A2'))
    .then(r => doSomethingAsync('A3'))
    .then(r => doSomethingAsync('A4'))
    .then(r => promiseRoot.$chainComplete());

await promiseRoot.$chain;
console.log("Chain completed; handlerCalled =", handlerCalled) // 4
```

#### 5. Aborting a Chain - `$chainAbort()`

Calling `$chainComplete()` on a multibranch chain may complete and expire
the chain before all branches are completed. If that's the behavior you want, you should use
the semantic variant `$chainAbort()` to clarify the source code. Otherwise, use the AutoComplete for such cases.
 
```js
let handlerCalled = 0;

// ---helper
let doSomethingAsync = function (name) {
    console.log("called:", name);
    handlerCalled++;
    // block the handler by returning a unpredictable pending promise:
    return new Promise(function (resolve){
        setTimeout(resolve, Math.random()*50)
    });
};
// ---

let promiseRoot = JFactoryPromise.resolve();

// Branch A
promiseRoot
    .then(r => doSomethingAsync('A1'))
    .then(r => doSomethingAsync('A2'))
    // will interrupt the chain event if branch B is not completed:
    .then(r => promiseRoot.$chainAbort()); 

// Branch B
promiseRoot
    .then(r => doSomethingAsync('B1'))
    .then(r => doSomethingAsync('B2'));

await promiseRoot.$chain;
console.log("Chain completed; handlerCalled =", handlerCalled) // 3 or 4
```
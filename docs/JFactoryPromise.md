[jFactory](index.md) > [Reference](ref-index.md) > [Classes](ref-index.md#classes-internal-library) > JFactoryPromise

# JFactoryPromise

[Properties](#properties) / [Methods](#methods) / [Options](#options) / [Usages](#usages)

Promise where the <b>whole tree can be awaited, aborted and expired</b>.\
Provides synchronous status, explorable chain map, shared data, debug data and trace.

```javascript
import { JFactoryPromise } from "jfactory" 
let myPromise, a, b;

// --- Await the whole tree ---

(async function() {
    myPromise = JFactoryPromise.resolve('ok');
    a = myPromise.then(h).then(h);
    b = myPromise.then(h).then(h);
    // will expire the chain as soon as no more promises are pending:          
    myPromise.$chainAutoComplete();
    // wait for all promises         
    await myPromise.$chain;
    console.log("done");
    // chain expired, new handlers not called (passthrough):
    myPromise.then(h);
    a.then(h);
    b.then(h).then(h);
})();

// --- Abort the whole tree ---

myPromise = JFactoryPromise.resolve('hello');
a = myPromise.then(h);
b = myPromise.then(h).then(h);
// abort the whole tree, handlers not called:
myPromise.$chainAbort("aborted !");
// chain expired, new handlers not called (passthrough):
myPromise.then(h);
a.then(h);
b.then(h).then(h);

// handler
function h(value) {/*console.log(value);*/return value}

``` 

* [Status](#promise-status)
* [Chain](#promise-chain)
* [Chain Completion](#chain-completion--abortion)
* [Chain Abortion](#chain-completion--abortion)
* [Chain Expiration](#chain-expiration)
* [Chain Awaitable](#chain-awaitable)
* [Shared Properties](#shared-properties)

## Promise Status

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

#### $isAborted
>Type: `boolean` Default: `false`
>
>Becomes `true` if the promise was aborted.
>
>See also [Chain Expiration](#chain-expiration).

#### $isExpired
>Type: `boolean` Default: `false`
>
>Becomes `true` if the promise has expired (after complete or abort).
>
>See also [Chain Expiration](#chain-expiration).

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
>Can be `then` `await` `catch` `$thenExpired` or `promise`

### Shared Properties

When using then() or catch(), the enumerable properties of the promise are copied to the new subpromise.
This is useful to inherit methods and share objects through the chain,
but keep in mind that primitives properties are copied by value, not by reference.

#### $chain (shared)
>Type: `object`
>
>The [Promise Chain Manager](#promise-chain) shared by all promises of the chain.

## Methods

### `$chainAbort([reason = "$chainAbort()"])`
>Returns: `this (JFactoryPromise)`
>
>Aborts the pending promises of the whole chain, then
>marks the chain as [Completed](#chain-completion--abortion) and [Expires](#chain-expiration) all the promises of the chain.
>
>```js
>promise.$chainAbort("aborted by user");
>
>await promise.$chain; // resolved by $chainAbort() 
>```

### `$chainComplete([reason = "$chainComplete()"])`
>Returns: `this (JFactoryPromise)`
>
>Marks the chain as [Completed](#chain-completion--abortion) and [Expires](#chain-expiration) all the promises of the chain.  
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
>Automatically [Completes](#chain-completion--abortion) the chain as soon as all its promises are fulfilled.  
>You don't need to use this method if you are not [awaiting the whole chain](#chain-awaitable).  
>A completed chain is also fully [Expired](#chain-expiration).
>
>Note: It's a shortcut that sets `myPromise.$chain.chainConfig.chainAutoComplete` to `true`.

### `$thenIfExpired(handler)`
>Returns: `this (JFactoryPromise)`
>
>Like `then()`, but the handler is called only if the chain is expired.
>
>```js
>let promise = JFactoryPromise.resolve()
>   .then(()=>{/* not called because aborted below */})
>   .$thenIfExpired(errorExpired => {
>       console.error(errorExpired);
>       console.error(errorExpired.$data.reason) // aborted!
>   });
>
>promise.$chainAbort("aborted!");
>```
<!--
### `$toPromise()`
> Returns: `Promise`
>
>Convert the JFactoryPromise to a native Promise.
-->
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
>
>// Caution, if using options, the second argument is required
>
>JFactoryPromise.resolve({name: "myPromise", config: {
>    chainAutoComplete: true
>}}, undefined);
>```

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
>
>// Caution, if using options, the second argument is required
>
>JFactoryPromise.reject({name: "myPromise", config: {
>    chainAutoComplete: true
>}}, undefined);
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
>True if the chain is [marked as completed](#chain-completion--abortion).

## Chain Completion / Abortion

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

When a chain is [Completed](#chain-completion--abortion), all the (new and old) promises of the chain are expired:
* All handlers installed by `then()` and `catch()` are ignored.
* The handlers installed by [`$thenIfExpired()`](#$thenIfExpired) are reachable

## Chain Awaitable

The whole [Promise Chain](#promise-chain) can be awaited through the property `$chain`
and resolved synchronously when the chain is [marked as Completed](#chain-completion--abortion):

`await myPromise.$chain`

## Usages

#### 1. Instantiation (classic)
```js
let myPromise = new JFactoryPromise((resolve, reject) => {
    resolve('ok')
});

// also
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

await promiseRoot.$chain; // $chain is accessible from all its promises
console.log("Chain completed; handlerCalled =", handlerCalled); // 4

// ---helper
function (namedoSomethingAsync) {
    console.log("called:", name);
    handlerCalled++;
    // block the handler by returning an unpredictable pending promise:
    return new Promise(function (resolve){
        setTimeout(resolve, Math.random()*50)
    });
}
```

#### 4. Manual Completion - `$chainComplete()`

Manually marks the chain as completed by calling `$chainComplete()` in the last then() of the tree. This exprires the chain. Should only be reliable for vertically chained promises (not with multibranch chains. See example 5).

```javascript
let handlerCalled = 0;
let promiseRoot = JFactoryPromise.resolve()
    .then(r => doSomethingAsync('A1'))
    .then(r => doSomethingAsync('A2'))
    .then(r => doSomethingAsync('A3'))
    .then(r => doSomethingAsync('A4'))
    .then(r => promiseRoot.$chainComplete());

await promiseRoot.$chain;
console.log("Chain completed; handlerCalled =", handlerCalled) // 4

// ---helper
function doSomethingAsync(name) {
    console.log("called:", name);
    handlerCalled++;
    // block the handler by returning a unpredictable pending promise:
    return new Promise(function (resolve){
        setTimeout(resolve, Math.random()*50)
    });
}
```

#### 5. Aborting a Chain - `$chainAbort()`

Calling `$chainComplete()` on a multibranch chain may complete and expire the chain before all branches are completed. This will result to an error. If you want to abort the chain, you should use
`$chainAbort()`. Otherwise, use the AutoComplete for such cases.

```js
let handlerCalled = 0;

// ---helper
let doSomethingAsync = function (name) {
    console.log("called:", name);
    handlerCalled++;
    // block the handler by returning a unpredictable pending promise:
    return new Promise(function (resolve){
        setTimeout(resolve, Math.random()*500)
    });
};
// ---

let promiseRoot = JFactoryPromise.resolve();

// Branch A
promiseRoot
    .then(r => doSomethingAsync('A1'))
    .then(r => doSomethingAsync('A2'))
    // interrupt and expire the chain, even if branch B is not completed:
    .then(r => promiseRoot.$chainAbort()); 

// Branch B
promiseRoot
    .then(r => doSomethingAsync('B1'))
    .then(r => doSomethingAsync('B2'));

await promiseRoot.$chain;
console.log("Chain completed; handlerCalled =", handlerCalled) // 3 or 4
```
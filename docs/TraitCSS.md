[jFactory](../README.md) > [Reference](ref-index.md) > [Traits](ref-index.md#traits-component-features) > TraitCSS

# TraitCSS

[Registry](#registry) / [Methods](#injected-methods) / [Usages](#usages)

Registers CSS that will be automatically removed at [Remove Phase](TraitService-Phases.md#remove-phase).

## Registry
`myComponent.$.css`

## Injected Methods

### `$css(registryId {string}, styleBody {string})`
Returns: `jQuery selection`  

Calls jQuery to create and append to `<head>` an HTMLStyleElement containing the value of `styleBody`.

```javascript
myComponent.$css('myStyle', "div {border: 1px solregistryId red}");
```
* Setting the Element id on the fly
    
    >Preceding the `registryId` with a "#" will also set the Element id:    
    >```javascript
    >myComponent.$css("#css1", "body {color:red}").appendTo("body")
    >// => creates a style with id = css1
    >```

### `$cssFetch(registryId {string}, url {string})`
Returns: [`JFactoryPromise`](JFactoryPromise.md) resolved as a jQuery 

Loads a CSS file by appending a `<link type="stylesheet" href=[url]>` into `<head>`
and returns a promise that can be awaited.

>**Defers current Phase**: This method registers a Task that blocks the resolution of the current Phase (if any) until the whole Task chain (including subpromises) is resolved.

>**Auto completed**: The promise chain is completed and expired as soon as all subpromises are resolved. This behavior can be disabled by setting `anyPromiseOfTheChain.$chain.chainConfig.chainAutoComplete = false` before the promise chain is completed.

* Setting the Element id on the fly 
    
    >Preceding the `registryId` with a "#" will also set the Element id.
    See `$css()`    

### `$cssRemove(registryId {string} [, reason {string} = "$cssRemove()]")`

Removes the CSS registered with the key `registryId` previously created by `$css()` or `$cssFetch()`.

An optional `reason` can be given for debugging the expired `cssFetch()` Promise Chain. 

### `$cssRemoveAll(removePhase)`

*(Automatically called at [Remove Phase](TraitService-Phases.md#remove-phase))*

Removes any CSS previously registered by `$css()` or `$cssFetch()` if their [Remove Phase](TraitService-Phases.md#remove-phase) match the given `removePhase`.


```javascript
myComponent.$cssRemoveAll(jFactory.PHASE.DISABLE)
```

## Usages
<!--
```javascript
let myComponent = jFactory('myComponent', {
    style : `
        #myDiv {display:block}
        body {border: 1px solid red}
    `,
    onInstall : function() {
        this.$cssFetch('myComponentCSS', "style.css")
    },
    onEnable : function() {
        this.$css('myComponentStyle1', this.style)
    }
 });

await myComponent.$install(true); // install() + enable() 
await myComponent.$disable(); // Remove myComponentStyle1 from document and registry
await myComponent.$enable(); // Add myComponentStyle1

// Add another style while enabled  
myComponent.$css('myComponentStyle2', myComponent.style);

// Force the removal of all CSS marked to be removed at disable phase:
// myComponentStyle1, myComponentStyle2, but not myComponentCSS
myComponent.$cssRemoveAll(jFactory.PHASE.DISABLE);

await myComponent.$uninstall(); // removes everything  
```
-->
[jFactory](../README.md) > [Reference](index.md) > [Traits](index.md#traits-component-features) > TraitDOM

# TraitDOM

[Registry](#registry) / [Methods](#injected-methods) / [Usages](#usages)

Registers the result of a jQuery selection that will be automatically removed from document at [Remove Phase](TraitService-Phases.md#remove-phase).

## Registry
`myComponent.$.dom`

## Injected Methods

### `$dom(registryId {string}, jQueryArgument {selector|HTML|HTMLElement|jQuery selection|array of HTMLElements})`
Returns: `jQuery selection`

Registers the jQuery selection returned by `$(jQueryArgument)`, with the key `registryId`.
It can be a string selector, an array of dom elements or a jQuery selection. See https://api.jquery.com/jQuery.
 
**Note**: `$dom()` should only be used to register parent containers that
 must be cleared later with all their contents. It is useless to call
 `$dom()` for childNodes of these containers.       

#### Register existing Elements from a Selector
   ```javascript
   myComponent.$dom("boxes", "#box1 .boxes, #box2 .boxes")
   ```

#### Register new Elements from HTML

   ```javascript
   myComponent
    .$dom("boxes", '<div id="box1"><div id="box2">')
    .appendTo('body')
   ```
* Setting the Element id on the fly
    
    >Preceding the `registryId` with a "#" will also set the Element id of the first resulting element:    
    >```javascript
    >myComponent.$dom("#box1", "<div>").appendTo("body")
    >// => creates a div with id = box1
    >```

### `$domFetch(registryId {string}, url {string} [, fetchOptions {object} = {}])`
Returns: [`JFactoryPromise`](JFactoryPromise.md) resolved as a jQuery 

Register the jQuery selection resulting from the HTMLFragment loaded from `url` and returns a promise that can be awaited.

>**Defers current Phase**: This method registers a Task that blocks the resolution of the current Phase (if any) until the whole Task chain (including subpromises) is resolved.

>**Auto completed**: The promise chain is completed and expired as soon as all subpromises are resolved. This behavior can be disabled by setting `anyPromiseOfTheChain.$chain.chainConfig.chainAutoComplete = false` before the promise chain is completed.

* Setting the Element id on the fly 
    
    >Preceding the `registryId` with a "#" will also set the Element id of the first resulting element.
    See `$dom()`    

### `$domRemove(registryId {string} [, reason {string} = "$domRemove()]")`

Removes the DOM registered with the key `registryId` previously created by `$dom()` or `$domFetch()`. 
An optional `reason` can be given for debugging the aborted `domFetch()` Promise Chain.

### `$domRemoveAll(removePhase)`

*(Automatically called at [Remove Phase](TraitService-Phases.md#remove-phase))*

Removes any DOM Elements previously registered by `$dom()` or `$domFetch()` if their [Remove Phase](TraitService-Phases.md#remove-phase) match the given `removePhase`.

```javascript
myComponent.$domRemoveAll(jFactory.PHASE.DISABLE)
```

## Usages
<!--
```javascript
let myComponent = jFactory("myComponent", {
    html : `
        <div id="container1"></div>
        <div id="container2"></div>
    `,
    onInstall() {
        // Create and register DOM Elements
        this.$dom("myContainers", this.html)
            .appendTo('body');

        // Import and register DOM Elements
        this.$domFetch("myAssets", "asset.html")
            .then(dom=>dom.appendTo('body'));
    },
    onEnable() {
        // simulate some external creations
        let htmlElement = $('<div></div>').appendTo('body')[0];
        $('<div class="view"></div><div class="view"></div>').appendTo('body');

        // Register existing DOM Elements using a jQuery selector
        this.$dom("myViews", "body div.view");

        // Register a DOM Element using an HTMLElement
        this.$dom("myTempDiv", htmlElement);
    }
});

await myComponent.$install(true); // install() + enable() 
await myComponent.$disable(); // Removed myViews and myTempDiv from document and registry 
await myComponent.$enable(); // Recreates them

// Add another elements while enabled 
myComponent.$dom('myAssets2', '<div id="asset2a"><div id="asset2b">')
    .appendTo('body');

// Force the removal of all DOM marked to be removed at disable phase:
// myViews, myTempDiv, myAssets2, but not myContainers, myAssets
myComponent.$domRemoveAll(jFactory.PHASE.DISABLE);

await myComponent.$uninstall(); // removes everything
```
-->
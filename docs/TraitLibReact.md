[jFactory](index.md) > [Reference](ref-index.md) > [Traits](ref-index.md#traits-component-features) > TraitLibReact

# TraitLibReact

[Registry](#registry) / [Methods](#injected-methods) / [Usages](#usages)

Registers a React view that will be automatically destroyed and removed from document at [Remove Phase](TraitService-Phases.md#remove-phase).

## Registry
`myComponent.$.react`

## Injected Methods

### `$react(registryId {string}, container, element [, callback]) `
Returns: `React`

Renders a React view and registers it. 

```javascript
let myReactElement = React.createElement(MyReactComponent);
let myReactContainer = $('<div id="dom1">').appendTo("body");

let view = myComponent.$react("myReactView", myReactContainer, myReactElement);
```

### `$reactRemove(registryId {string})`

Destroy and removes the React registered with the key `registryId` previously created by `$react()`. 

```javascript
myComponent.$reactRemove("myReactView");
```
### `$reactRemoveAll(removePhase)`

*(Automatically called at [Remove Phase](TraitService-Phases.md#remove-phase))*

Destroy and removes any React previously registered by `$react()` if their [Remove Phase](TraitService-Phases.md#remove-phase) match the given `removePhase`.

```javascript
myComponent.$reactRemoveAll(jFactory.PHASE.DISABLE)
```

## Usages
<!--
```javascript
```
-->
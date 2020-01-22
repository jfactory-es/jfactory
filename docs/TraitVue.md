[jFactory](index.md) > [Reference](ref-index.md) > [Traits](ref-index.md#traits-component-features) > TraitVue

# TraitVue

[Registry](#registry) / [Methods](#injected-methods) / [Usages](#usages)

Registers a Vue.js object that will be automatically destroyed and removed from document at [Remove Phase](TraitService-Phases.md#remove-phase).

## Registry
`myComponent.$.vue`

## Injected Methods

### `$vue(registryId {string}, vue {Vue}) `
Returns: `Vue object`

```javascript
myComponent.$vue("myVue", new Vue({
    el: "#dom1",
    data: {}
}));
```

### `$vueRemove(registryId {string})`

Destroy and removes the Vue registered with the key `registryId` previously created by `$vue()`. 

```javascript
myComponent.$vueRemove("myView");
```
### `$vueRemoveAll(removePhase)`

*(Automatically called at [Remove Phase](TraitService-Phases.md#remove-phase))*

Destroy and removes any Vue previously registered by `$vue()` if their [Remove Phase](TraitService-Phases.md#remove-phase) match the given `removePhase`.

```javascript
myComponent.$vueRemoveAll(jFactory.PHASE.DISABLE)
```

## Usages
<!--
```javascript
```
-->
[jFactory](../README.md) > [Reference](index.md) > [Traits](index.md#traits-component-features) > TraitInterval

# TraitInterval

[Registry](#registry) / [Methods](#injected-methods) 

Registers intervals that will be automatically stopped and removed at [Remove Phase](TraitService-Phases.md#remove-phase).

## Registry

`myComponent.$.timeints`

## Injected Methods

### `$interval(registryId {string}, delay, handler [, ...args])`  

```javascript
myComponent.$interval("myInterval", 1000, (arg1, arg2) => {}, "arg1", "arg2")
```

### `$intervalRemove(registryId {string})` 

Removes the interval registered with the key `registryId` previously created by `$interval()`.

### `$intervalRemoveAll(removePhase)` 

*(Automatically called at [Remove Phase](TraitService-Phases.md#remove-phase))*

Removes any timer previously created by `$interval()` if their [Remove Phase](TraitService-Phases.md#remove-phase) match the given `removePhase`.

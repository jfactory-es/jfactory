[jFactory](../README.md) > [Reference](ref-index.md) > [Traits](ref-index.md#traits-component-features) > TraitCore

#TraitCore

[Properties](#properties) / [Methods](#injected-methods) / [Options]() / [Usages]()

Registers a $PLACEHOLDER that will be automatically removed from document at [Remove Phase](TraitService-Phases.md#remove-phase).   

##Injected Methods

###`$PLACEHOLDER(name {string})`
>Returns: ``  
>
>```javascript
>```

* Called with only `name` as argument:

    >Returns the `` registered with the key `name`.

###`$PLACEHOLDERRemove(name {string}, reason {string} = "$PLACEHOLDERRemove()")`
>
>Removes 

###`$PLACEHOLDERRemoveAll(phase)`
>
>Removes 

##Usages

```javascript
import {jFactory} from "jfactory-es";

let myComponent = jFactory("myComponent", {
    onInstall() {
    },
    onEnable() {
    }
});

await myComponent.$install(true);
```
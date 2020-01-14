[jFactory](../README.md) > [Reference](index.md) > [Traits](index.md#traits-component-features) > TraitState

# TraitState

[Registry](#registry) / [Methods](#injected-methods) / [Usages](#usages)

Provides the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) `$.states` that triggers [Component Events](TraitEvents.md) on property changes.
The states can be changed directly by assignation, or through `$state()` which allows
to wait for asynchronous event handlers.
      
The "enabled" and "installed" [Service States](TraitService-States.md) are accessible in this object.

## Registry
`myComponent.$.states`

## Injected Methods

### $state(key {string}, val {*}, notify = true {boolean})]

Returns: `JFactoryPromiseSync`

Sets or changes a state and, if `notify` is true (optional default), trigger `beforeStateChange` and `afterStateChange`.
Using this method instead of just setting the value in `myComponent.$.states`
allows to await for the completion of asynchronous handlers.  

```javascript
myComponent.$on("beforeStateChange", (event, eventData) => {
    this.$log(eventData.key, eventData.previousVal+' => '+eventData.val)
});

myComponent.$on("afterStateChange", (event, eventData) => {
    this.$log(eventData.key, eventData.previousVal+' => '+eventData.val)
});

await myComponent.$state("myState", "1234")
``` 

## Usages
<!--
```javascript
import {jFactory} from "jfactory-es";

let myComponent = jFactory("myComponent", {
    onEnable() {
        this.on("beforeStateChange", ()=>{
        });    
        this.on("afterStateChange", ()=>{
        })    
    }   
});

(async function(){
    await myComponent.$install(true);
    myComponent.$.states.name = "John";
    await myComponent.$setState("name", "John Doe")
}())
```
-->
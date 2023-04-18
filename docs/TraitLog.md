[jFactory](index.md) > [Reference](ref-index.md) > [Traits](ref-index.md#traits-component-features) > TraitLog

# TraitLog

 [Methods](#injected-methods) / [Usages](#usages)

Attachs a configurable console logger to the component, using `JFactoryLogger`.

* The logs are automatically labeled with the value of [`myComponent.$.about.name`](TraitAbout.md)
* The logger can be enabled or disabled at runtime.

Although it is not directly supported by TraitLog, a `JFactoryLogger` can also:
* Create children that can be disabled by inheritance.  
* Filter by label and methods (log, warn, error).   

### Inherited config

By default, for all components, logs are :
* disabled when using the production distribution of jFactory.
* enabled when using the development distribution of jFactory.


[//]: # (TODO This behavior can be changed by setting jFactoryConfig.TraitLog.enabled = true | false)

### Component config
 
* `myComponent.$.logger.enable()`
* `myComponent.$.logger.disable()`

## Injected Methods

### `$log(obj {*} [, ...obj {*}])`

### `$logWarn(obj {*} [, ...obj {*}])`

### `$logErr(obj {*} [, ...obj {*}])`


## Usages

```javascript
myComponent.$log("mouse enter the element", domTarget)
myComponent.$logWarn("request timeout", request)
myComponent.$logErr("error:", errorObject)
```

<!--
```javascript
import { jFactory } from "jfactory";

let myComponent = jFactory("myComponent", {
    onInstall() {
        this.log("installed");
    }
});

await myComponent.$install(true);
myComponent.$.logger.disable();
myComponent.$log('not logged')
myComponent.$.logger.enable();
myComponent.$logWarn("shutting down");
await myComponent.$uninstall()
```
-->
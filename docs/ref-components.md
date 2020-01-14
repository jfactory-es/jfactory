[jFactory](../README.md) > [Reference](index.md) > Components 

# Components

Components are Objects extended by `JFactoryTraits` to provide the features of jFactory.

* [Create a Component (literal)](#create-a-component-literal)
* [Create a Component (base class)](#create-a-component-base-class)

## Component Creation

### Create a Component (literal)

The shortcut `jFactory(name, ...sources)` creates a component using the class `JFactoryComponent` that provides all the default [Traits](index.md#traits-component-features). It also imports the properties and methods given as a second parameter into the new component. 

This is suitable for Object Literal declarations, when you don't need Object Inheritance:

```javascript
import {jFactory} from "jfactory-es";

let myComponent = jFactory('myComponentName', {
    myProperty: 123,
    myMethod: function() {}
})
```

### Create a Component (base class)

Alternatively, JFactoryTraits can transform any Class to a jFactory Component Class 
(including Classes that extends HTMLElement to create Web Components).

Here is an example with a custom Component Base Class, and a custom shortcut that produce the same behavior as `jFactory()` :

```javascript
import {jFactory, jFactoryTraits} from "jfactory-es";

class MyCustomComponentBase {
    constructor(name) {
        jFactoryTraits(this, MyCustomComponentBase)
            // JFactoryCoreObject
            .use(jFactory.TraitCore)
            .use(jFactory.TraitAbout, {name})
            .use(jFactory.TraitLog)
            .use(jFactory.TraitEvents)
            .use(jFactory.TraitState)
            .use(jFactory.TraitService)
            .use(jFactory.TraitTask)        
            // JFactoryComponent
            .use(jFactory.TraitFetch)
            .use(jFactory.TraitDOM)
            .use(jFactory.TraitCSS)
            .use(jFactory.TraitMutation)
            .use(jFactory.TraitTimeout)
            .use(jFactory.TraitInterval)
    }
}

function createComponent(name, properties) {
    return Object.assign(new MyCustomComponentBase(name), properties)
}

let myComponent1 = createComponent('Component1', {
    myProperty: 123,
    myMethod: function() {alert(this.myProperty)}
});

let myComponent2 = createComponent('Component2', {
    sayHello: function() {alert('hello')}
});
```
Also works with inheritance:

```javascript
import {jFactory, jFactoryTraits} from "jfactory-es";

class ComponentTypeA {
    constructor(name, value) {
        jFactoryTraits(this, ComponentTypeA)
            .use(jFactory.TraitCore)
            .use(jFactory.TraitAbout, {name})
            .use(jFactory.TraitLog)
            .use(jFactory.TraitEvents)
            .use(jFactory.TraitState)
            .use(jFactory.TraitService)
            .use(jFactory.TraitTask);        

        this.myProperty = value;
    }
    myMethod() {alert(this.myProperty)}
}

class ComponentTypeB extends ComponentTypeA {
    constructor(name, value) {
        super(name, value);
        jFactoryTraits(this, ComponentTypeB)
            .use(jFactory.TraitFetch)
            .use(jFactory.TraitDOM)
            .use(jFactory.TraitCSS)
            .use(jFactory.TraitMutation)
            .use(jFactory.TraitTimeout)
            .use(jFactory.TraitInterval);    
    }
    sayHello() {alert('hello')}
}

let myComponent1 = new ComponentTypeA('Component1', 123);
let myComponent2 = new ComponentTypeB('Component2');
```
[jFactory](index.md) > [Reference](ref-index.md) > Components 

# Components

Components are Objects extended by `JFactoryTraits` to provide the features of jFactory.

* [Create a Component (literal)](#create-a-component-literal)
* [Create a Component (inherit)](#create-a-component-inherit)
* [Create a Component (base class)](#create-a-component-base-class)

## Component Creation

### Create a Component (literal)

The shortcut `jFactory(name, ...sources)` creates a component using the class `JFactoryComponent` that provides all the default [Traits](ref-index.md#traits-component-features). It also imports the properties and methods given as a second parameter into the new component. 

This is suitable for Object Literal declarations, when you don't need Object Inheritance:

```javascript
import { jFactory } from "jfactory";

let myComponent = jFactory('myComponentName', {
    myProperty: 123,
    myMethod: function() {}
})
```

### Create a Component (inherit)

You can create your Class component by inheriting from JFactoryComponent (which inherits from JFactoryCoreObject)

```javascript
import { JFactoryComponent } from "jfactory";

class MyComponentClass extends JFactoryComponent {
    constructor(name) {
        super(name);
    }
}

let myComponent1 = new MyComponentClass('Component1', 123);
await myComponent1.$install(true);
```

### Create a Component (base class)

Alternatively, JFactoryTraits can transform any Class to a jFactory Component Class 
(including Classes that extends HTMLElement to create [Web Components](playground/class-webcomp.md)).

Here is an example with a custom Component Base Class, and a custom shortcut that produce the same behavior as `jFactory()` :

```javascript
import { JFactoryCoreObject, JFactoryComponent } from "jfactory";

class MyCustomComponentBase {
    constructor(name) {

        JFactoryCoreObject.inject(this, MyCustomComponentBase, name);
        JFactoryComponent.inject(this, MyCustomComponentBase);

        /*
        Shortcut to:        
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
            .use(jFactory.TraitLibVue)
            .use(jFactory.TraitLibReact);
        */
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
import { JFactoryCoreObject, JFactoryComponent } from "jfactory";

class ComponentTypeA {
    constructor(name, value) {
        JFactoryCoreObject.inject(this, ComponentTypeA, name);

        /* shortcut to:
        jFactoryTraits(this, ComponentTypeA)
            .use(jFactory.TraitCore)
            .use(jFactory.TraitAbout, {name})
            .use(jFactory.TraitLog)
            .use(jFactory.TraitEvents)
            .use(jFactory.TraitState)
            .use(jFactory.TraitService)
            .use(jFactory.TraitTask);        
        */

        this.myProperty = value;
    }
    myMethod() {alert(this.myProperty)}
}

class ComponentTypeB extends ComponentTypeA {
    constructor(name, value) {
        super(name, value);
        JFactoryComponent.inject(this, ComponentTypeB);

        /* shortcut to:
        jFactoryTraits(this, ComponentTypeB)
            .use(jFactory.TraitFetch)
            .use(jFactory.TraitDOM)
            .use(jFactory.TraitCSS)
            .use(jFactory.TraitMutation)
            .use(jFactory.TraitTimeout)
            .use(jFactory.TraitInterval)
            .use(jFactory.TraitLibVue)
            .use(jFactory.TraitLibReact);
        */    
    }
    sayHello() {alert('hello')}
}

let myComponent1 = new ComponentTypeA('Component1', 123);
let myComponent2 = new ComponentTypeB('Component2');
```
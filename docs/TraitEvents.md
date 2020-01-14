[jFactory](../README.md) > [Reference](index.md) > [Traits](index.md#traits-component-features) > TraitEvents

# TraitEvents

[Registry](#registry) / [Methods](#injected-methods)

Registers DOM Event Listeners and Component Event Observers that will be removed at [Remove Phase](TraitService-Phases.md#remove-phase).

* [Queued vs Parallel execution](#queued-vs-parallel-execution)
* [Event Namespaces](#event-namespaces)
* [Event Delegation](#event-delegation)

***
**Note:** TraitEvents is based on [JFactoryEvents](JFactoryEvents.md) that redirects to [jQuery Events](https://learn.jquery.com/events) wich 
supports advanced features like [Event Namespaces](#event-namespaces) and [Event Delegation](#event-delegation).
***

## Registry

`myComponent.$.listeners` for DOM Events\
`myComponent.$.observers` for Component Events

## Injected Methods

### $on(events [, targetSelector [, delegateSelector]], handler)

* Subscribe a DOM Event Listener:

    ```javascript
    myComponent.$on("pointerdown pointerup", "#container div.menu", ".menu-button", event=>{})
    ``` 

* Subscribe a Component Event Observer:

    ```javascript
    myComponent.$on("myEvent", (event, data)=>{})
    ```
    
### $off([events, [target [, selector]] [, handler]])

* Unsubscribe DOM Events:

    ```javascript
    myComponent.$off("pointerdown pointerup", "body")
    myComponent.$off("pointerdown", "#container div.menu")
    myComponent.$off("pointerdown", "#container div.menu", ".menu-button")
    myComponent.$off("pointerdown", "#container div.menu", ".menu-button", handler)
    myComponent.$off("pointerdown", "#container div.menu", handler)
    myComponent.$off("pointerdown", handler)
    ```
  
* Unsubscribe Observers:

    ```javascript
    myComponent.$off("myEvent1 myEvent2")
    myComponent.$off("myEvent2", handler)
    ```

* #### $off() without argument

    Automatically called at [Remove Phase](TraitService-Phases.md#remove-phase).
    
    Called without argument, it will remove all handlers attached to the component.

* #### $off() with Namespaces

    When namespaces are provided, `$off()` only removes handlers matching all these namespaces. If one of the given namespace doesn't match, the handler is not removed:

    ```javascript
    myComponent.$on("click.myNamespace1.myNamespace2", "body", handler1)
    myComponent.$on("click.myNamespace2.myNamespace1", "body", handler2)
    
    myComponent.$off(".myNamespace2.anotherNamespace", "body") // removes nothing
    myComponent.$off(".myNamespace2", "body") // removes the two handlers
    ```

### $trigger(events [, target] [, data]) {
Returns `Promise`


Calls the handlers registered by the component for each event passed in `events`.

Trigger is awaitable, see [Queued vs Parallel execution](#queued-vs-parallel-execution) 
* Trigger DOM Events: 

    ```javascript
     myComponent.$trigger("click", "#menu .button");
    ```

* Trigger Observers:
    ```javascript
    // attach same handler for two event
    myComponent.$on("myEvent1 myEvent2", (event, data)=>{})
    
    // call the handlers attached to "myEvent1" and pass data    
    await myComponent.$trigger("myEvent1", {data1:1})
    
    // calls handlers attached to "myEvent1" and "myEvent2" 
    // this results to call the same handler two times
    await myComponent.$trigger("myEvent1 myEvent2", {data1:1}) 
    ```

* #### $trigger() with Namespaces
    
    When namespaces are provided, `$trigger()` only calls handlers matching **all** these namespaces. If one of the given namespace doesn't match, the handler is not called: 
     
    ```javascript
    myComponent.$on("click.myNamespace1.myNamespace2", handler)
     
    // called:
    myComponent.$trigger("click") 
    myComponent.$trigger("click.myNamespace2") 
    myComponent.$trigger("click.myNamespace2.myNamespace1")  
     
    // not called:
    myComponent.$trigger("click.myNamespace1.anotherNamespace") 
    ```
    
    Same Handler, same Event Name, different Namespace:
    
    ```javascript
    myComponent.$on("myEvent.ns1 myEvent.ns2", handler)
     
    // called:
    myComponent.$trigger("myEvent")  // handler called 2x
    myComponent.$trigger("myEvent.ns1") // called 1x 
    myComponent.$trigger("myEvent.ns2 myEvent.ns1")  // called 2x
    myComponent.$trigger("myEvent myEvent.ns2")  // called 3x
     
    // not called:
    myComponent.$trigger("myEvent.ns1.ns2")  // myEvent with ns1+ns2 is not a registered handler
    myComponent.$trigger("myEvent.ns1.ns0")  
    myComponent.$trigger("myEvent.ns0")  
    ```

## Queued vs Parallel execution   
         
By default jFactory runs asynchronous handlers in the order of the queue, waiting for each one to resolve before launching the next one.   
You can also run all handlers asynchronously in parallel using `$triggerParallel()`
(not recommended because it's the best way to introduce race conditions):    
         
```javascript
myComponent.$on("myEvent", async (event, data  => {wait(100).then(console.log(1))})
myComponent.$on("myEvent", async (event, data) => {wait(1).then(console.log(2))})

await myComponent.$trigger("myEvent")
console.log(3)
// outputs 1,2,3 (queued) 

await myComponent.$triggerParallel("myEvent")
console.log(3)
// outputs 2,1,3 (Parallelized)
```

## Event Namespaces

An Event Namespace is a Group Name you can associate with events:

```javascript
myComponent.$on("click.myNamespace", ...)
myComponent.$on("keydown.myNamespace keyup.myNamespace", ...)
myComponent.$on("myEvent.myNamespace", ...)
```

This can be used to unsubscribe an entire group:

```javascript
myComponent.$off(".myNamespace")
```

You can attach multiple namespaces on an event but it doesn't form a path, the declaration order has no effect:

```javascript
myComponent.$on("click.myNamespace1.myNamespace2", handler1)
myComponent.$on("click.myNamespace2.myNamespace1", handler2)

myComponent.$off(".myNamespace2") // the two handlers are removed  
```
See also [jQuery Events](https://api.jquery.com/category/events/)

## Event Delegation

"Event delegation allows you to attach a single event listener, to a parent element, that will fire for all descendants matching a selector, whether those descendants exist now or are added in the future."
-- <cite>[learn.jquery.com](https://learn.jquery.com/events/event-delegation/)</cite>


```javascript
// Without event delegation:
// puts a listener on all elements matching $(".menu-button")
myComponent.$on("pointerdown", ".menu-button", event => {})

// With event delegation:
// puts a single listener on $("#container") which will react 
// at runtime if the event target match $("#container .menu-button")  
myComponent.$on("pointerdown", "#container", ".menu-button", event => {})
```
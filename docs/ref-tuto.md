[jFactory](index.md) > Reference

# jFactory Tutorial

## Mastering the Basics with Ease

Good news, jFactory is not a framework, so it's very fast to learn, use, an integrate on existing projects.

* How to **Install** 
  * for application bundled from node_modules: **ES6 module**.
  * for immediate inclusion in a web page: **UMD module**.
* Understand the **Concept**
  * jFactory extends a literal object or a class with methods and properties.
  * They are prefixed with a "$" to avoid conflicts with pre-existing ones, allowing for quick and easy integration with already-existing objects.
  * The pattern is simple: you use these methods to register things that produce side effects like CSS, DOM, events, promises, timers, requests, ... 
  * They are associated to 'Traits', sort of managers, which know how to remove it. This concept is extensible for your own plugins.
  * jFactory already provides Traits for WebApp usage by default, so you don't need to configure anything.
  * These methods register things, but also help you create or load them from external, all in once. This is based on jQuery, so it's very powerful.
  * Then, you have predefined event handlers called onInstall(), onEnable(), onDisable(), onUninstall(), that you can use to specify what you want to do when calling myComponent.$install(), $enable(), $disable(), $uninstall()... Typically load CSS, create DOM, set event handlers, request data...
  * The magic here is that every asynchronous things registers within these event handlers are pending in a insachronous task, so you can do 'await myComponent.$enable()' (or $disable(), ...) for example. 
  * But that's not all: everithing registered during (and after) $enable() is automatically removed during $disable(). Same for $uninstall() with $install() but it also calls $disable() to clean up the component. 
  * jFactory doesn't impose you anything: It helps you to clean what you register. Use only what you need.

* How to **Create a Component**
  * if your component is uniq, uses the **jFactory()** shortcut
  * if your component is instantiable, uses **Extended Classes** 

## Time to code: Practical examples!
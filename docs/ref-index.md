[jFactory](index.md) > Reference 

# jFactory Reference Index

#### Installation
* [Importing jFactory](ref-import.md) / [External Dependencies](ref-import.md#external-dependencies) / [Overriding](ref-import.md#overriding)
* [Playground](playground/README.md) /  [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

#### Concepts

* [Components](ref-components.md)
* [Service States](TraitService-States.md)
* [Service Phases](TraitService-Phases.md)

## Traits (Component Features)

The Traits provides the methods, properties and registry injected into your components (everything that starts with "$"). 

|                                   | Registry     | Injected methods                                                     |
|-----------------------------------|--------------|----------------------------------------------------------------------|  
| [TraitAbout](TraitAbout.md)       | `$.about`    |                                                                      |
| [TraitCSS](TraitCSS.md)           |` $.css`      | `$css()` `$cssFetch()` `$cssRemove()` `$cssRemoveAll()`              |
| [TraitDOM](TraitDOM.md)           | `$.dom`      | `$dom()` `$domFetch()` `$domRemove()` `$domRemoveAll()`              |
| [TraitEvents](TraitEvents.md)     | `$.listeners` `$.observers` | `$on()` `$off()` `$trigger()` `$triggerParallel()`    |
| [TraitFetch](TraitFetch.md)       | `$.requests` | `$fetch()` `$fetchText()` `$fetchJSON()` `$fetchRemove()` `$fetchRemoveAll()` |
| [TraitInterval](TraitInterval.md) | `$.timeints` | `$interval()` `$intervalRemove()` `$intervalRemoveAll()`             |
| <img height="16" src="https://vuejs.org/images/logo.png">[TraitLibVue](TraitLibVue.md)     | `$.vue`      | `$vue()` `$vueRemove()` `$vueRemoveAll()`                            |
| <img height="16" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg">[TraitLibReact](TraitLibReact.md) | `$.react`    | `$react()` `$reactRemove()` `$reactRemoveAll()`                            |
| [TraitLog](TraitLog.md)           | `$.logger`   | `$log()` `$logWarn()` `$logErr()`                                    |
| [TraitMutation](TraitMutation.md) | `$.mutations`| `$mutation()` `$mutationRemove()` `$mutationRemoveAll()`             |
| [TraitService](TraitService.md)   | `$.service`  | `$install()` `$enable()` `$disable()` `$uninstall()`                 |
| [TraitState](TraitState.md)       | `$.states`   | `$state()`                                                           |
| [TraitTask](TraitTask.md)         | `$.tasks`    | `$task()` `$taskRemove()` `$taskRemoveAll()`                         |
| [TraitTimeout](TraitTimeout.md)   | `$.timeouts` | `$timeout()` `$timeoutRemove()` `$timeoutRemoveAll()`                |
 
## Classes (Internal Library)

jFactory uses a set of ES6+ classes that can be imported from the jFactory bundle:

* JFactoryError
* JFactoryEvents
* JFactoryExpect
* [JFactoryFetch](JFactoryFetch.md)
* [JFactoryFunction](JFactoryFunction.md)
* JFactoryLogger
* JFactoryObject
* [JFactoryPromise](JFactoryPromise.md)
* JFactoryTraits
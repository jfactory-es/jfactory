[jFactory](index.md) > Reference 

# jFactory Reference Index

#### Installation
* [Importing jFactory](ref-import.md)
* [External Dependencies](ref-import.md#external-dependencies)
* [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)
* [Overriding](ref-import.md#overriding)

#### Concepts

* [Components](ref-components.md)
* [Service States](TraitService-States.md)
* [Service Phases](TraitService-Phases.md)

## Traits (Component Features)

The Traits provides the methods, properties and registry injected into your components (everything that starts with "$"). 

|                                   | Registery    | Injected methods                                                     |
|-----------------------------------|--------------|----------------------------------------------------------------------|  
| [TraitAbout](TraitAbout.md)       | `$.about`    |                                                                      |
| [TraitCSS](TraitCSS.md)           |` $.css`      | `$css()` `$cssFetch()` `$cssRemove()` `$cssRemoveAll()`              |
| [TraitDOM](TraitDOM.md)           | `$.dom`      | `$dom()` `$domFetch()` `$domRemove()` `$domRemoveAll()`              |
| [TraitEvents](TraitEvents.md)     | `$.listeners` `$.observers` | `$on()` `$off()` `$trigger()` `$triggerParallel()`    |
| [TraitFetch](TraitFetch.md)       | `$.requests` | `$fetch()` `$fetchText()` `$fetchJSON()` `$fetchRemove()` `$fetchRemoveAll()` |
| [TraitInterval](TraitInterval.md) | `$.timeints` | `$interval()` `$intervalRemove()` `$intervalRemoveAll()`             |
| [TraitLog](TraitLog.md)           | `$.logger`   | `$log()` `$logWarn()` `$logErr()`                                    |
| [TraitMutation](TraitMutation.md) | `$.mutations`| `$mutation()` `$mutationRemove()` `$mutationRemoveAll()`             |
| [TraitService](TraitService.md)   | `$.service`  | `$install()` `$enable()` `$disable()` `$uninstall()`                 |
| [TraitState](TraitState.md)       | `$.states`   | `$state()`                                                           |
| [TraitTask](TraitTask.md)         | `$.tasks`    | `$task()` `$taskRemove()` `$taskRemoveAll()`                         |
| [TraitTimeout](TraitTimeout.md)   | `$.timeouts` | `$timeout()` `$timeoutRemove()` `$timeoutRemoveAll()`                |
| [TraitVue](TraitVue.md)           | `$.vue`      | `$vue()` `$vueRemove()` `$vueRemoveAll()`                            |
 
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
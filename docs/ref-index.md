[jFactory](index.md) > Reference 

# jFactory Reference Index

#### Installation
* [Importing jFactory](ref-import.md) <!--/ [External Dependencies](ref-import.md#external-dependencies)--> / [Overriding](ref-overriding.md)
* [Playground](playground/README.md) /  [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)

#### Concepts

* [Components](ref-components.md)
* [Service States](TraitService-States.md)
* [Service Phases](TraitService-Phases.md)

## Traits (Component Features)

The Traits provides the methods, properties and registry injected into your components (everything that starts with "$"). 

|                                   | Registry     | Injected methods                                                     |
|-----------------------------------|--------------|----------------------------------------------------------------------|  
| [TraitAbout](TraitAbout.md)       | [`$.about`](TraitAbout.md)    |                                                                      |
| [TraitCSS](TraitCSS.md)           |[` $.css`](TraitCSS.md)      | [`$css()`](TraitCSS.md) [`$cssFetch()`](TraitCSS.md) [`$cssRemove()`](TraitCSS.md) [`$cssRemoveAll()`](TraitCSS.md)              |
| [TraitDOM](TraitDOM.md)           | [`$.dom`](TraitDOM.md)      | [`$dom()`](TraitDOM.md) [`$domFetch()`](TraitDOM.md) [`$domRemove()`](TraitDOM.md) [`$domRemoveAll()`](TraitDOM.md)              |
| [TraitEvents](TraitEvents.md)     | [`$.listeners`](TraitEvents.md) [`$.observers`](TraitEvents.md) | [`$on()`](TraitEvents.md) [`$off()`](TraitEvents.md) [`$trigger()`](TraitEvents.md) [`$triggerParallel()`](TraitEvents.md)    |
| [TraitFetch](TraitFetch.md)       | [`$.requests`](TraitFetch.md) | [`$fetch()`](TraitFetch.md) [`$fetchText()`](TraitFetch.md) [`$fetchJSON()`](TraitFetch.md) [`$fetchRemove()`](TraitFetch.md) [`$fetchRemoveAll()`](TraitFetch.md) |
| [TraitInterval](TraitInterval.md) | [`$.timeints`](TraitInterval.md) | [`$interval()`](TraitInterval.md) [`$intervalRemove()`](TraitInterval.md) [`$intervalRemoveAll()`](TraitInterval.md)             |
| <img height="16" src="https://vuejs.org/images/logo.png">[TraitLibVue](TraitLibVue.md)     | [`$.vue`](TraitLibVue.md)      | [`$vue()`](TraitLibVue.md) [`$vueRemove()`](TraitLibVue.md) [`$vueRemoveAll()`](TraitLibVue.md)                            |
| <img height="16" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg">[TraitLibReact](TraitLibReact.md) | [`$.react`](TraitLibReact.md)    | [`$react()`](TraitLibReact.md) [`$reactRemove()`](TraitLibReact.md) [`$reactRemoveAll()`](TraitLibReact.md)                            |
| [TraitLog](TraitLog.md)           | [`$.logger`](TraitLog.md)   | [`$log()`](TraitLog.md) [`$logWarn()`](TraitLog.md) [`$logErr()`](TraitLog.md)                                    |
| [TraitMutation](TraitMutation.md) | [`$.mutations`](TraitMutation.md)| [`$mutation()`](TraitMutation.md) [`$mutationRemove()`](TraitMutation.md) [`$mutationRemoveAll()`](TraitMutation.md)             |
| [TraitService](TraitService.md)   | [`$.service`](TraitService.md)  | [`$install()`](TraitService.md) [`$enable()`](TraitService.md) [`$disable()`](TraitService.md) [`$uninstall()`](TraitService.md)                 |
| [TraitState](TraitState.md)       | [`$.states`](TraitState.md)   | [`$state()`](TraitState.md)                                                           |
| [TraitTask](TraitTask.md)         | [`$.tasks`](TraitTask.md)    | [`$task()`](TraitTask.md) [`$taskRemove()`](TraitTask.md) [`$taskRemoveAll()`](TraitTask.md)                         |
| [TraitTimeout](TraitTimeout.md)   | [`$.timeouts`](TraitTimeout.md) | [`$timeout()`](TraitTimeout.md) [`$timeoutRemove()`](TraitTimeout.md) [`$timeoutRemoveAll()`](TraitTimeout.md)                |
 
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
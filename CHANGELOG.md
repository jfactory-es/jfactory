## 1.8.0 (2023)
* feat: starting implementation of a ts definition file 
* refactor: improved module tree shaking 
* refactor: module exports
* refactor: pear dependencies
* build: dependencies refactored and updated

## 1.7.7 (Jan 10, 2021)
* feat: generic external imports
* feat: warn for missing external dependencies
* feat: improved compatibility check
* feat: rollup configuration maker
* removed cjs version for universal module (umd)  
* refactor: version
* refactor: removed unused polyfill
  
## 1.7.4 (Jan 05, 2021)
* feat: JfactoryFetch: added compatibility test
* feat: detect playgrounds
* refactor: [JFactoryPromise](docs/JFactoryPromise.md): removed jquery dependencies
* refactor: JFactoryTrace: complete redesign
* refactor: env, config, compat, bootstrap, libs
* build: complete redesign
* build: supports raw /src import
* build: check node version
* build: dev-server 4 support (disabled by default)
* fix: CLI/REPL log formatter
  
## 1.7.0 (Sept 09, 2020)
* build: improved tree shaking

## 1.6.0 (Sept 04, 2020) 
* feat: wildcard "?" to subscribe with a generated unique id
* build: dependencies refactored and updated

## 1.5.0 (Feb 11, 2020)
* feat: improved phase-switching queueing     
* feat: [TraitCSS](docs/TraitCSS.md).$cssFetch(): don't duplicate rules with same url 
* feat: [TraitDom](docs/TraitDOM.md).$dom(): support textnodes in \<template>
* feat: [JFactoryPromise](docs/JFactoryPromise.md) improved abort and expire 

## 1.4.0 (Jan 28, 2020 )
* feat: Better support for [Web Components](docs/playground/class-webc.md)
* feat: Shortcuts for [Injecting the jFactory Traits into any Classes](docs/ref-components.md#create-a-component-base-class) 
* feat: [TraitCSS](docs/TraitCSS.md).$cssFetch(): appendTo option with default to "head"  

## 1.3.0 (Jan 24, 2020 )
* feat: [TraitLibReact](docs/TraitLibReact.md): added support to React

## 1.2.0 (Jan 22, 2020 )
* feat: [TraitLibVue](docs/TraitLibVue.md): added support to Vue.js
* feat: [TraitDOM](docs/TraitDOM.md).$dom(): added optional argument "appendTo"  
* feat: [TraitDOM](docs/TraitDOM.md).$dom(): support \<template> cloning  

## 1.1.0-beta.1 (Dec 17, 2019 )
* fix: sourcemap for development bundles
* fix: interrupt the pending phase on opposite phase change 
* feat: "await" throws the errorExpired if expired

## 1.0.0-beta.3 (Dec 13, 2019 )
* Initial public release

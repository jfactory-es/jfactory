<div align="center" markdown="1">
<img width="140" src="https://jfactory-es.github.io/jfactory/img/jFactory.png">

Easily modularize your application into cancelable components.<br>
<b>Everything they initialize can be monitored, stopped and removed automatically,<br>
including views, nested promises, requests, listeners, DOM and CSS.</b>

[![GitHub version](https://img.shields.io/github/package-json/v/jfactory-es/jfactory.svg?label=git)](https://github.com/jfactory-es/jfactory)
[![npm version](https://img.shields.io/npm/v/jfactory.svg)](https://www.npmjs.com/package/jfactory)
[![Tests](https://github.com/jfactory-es/jfactory/workflows/Node%20CI/badge.svg)](#implementation)

</div>

# jFactory

**Why?** Imagine a feature that uses views, css, event listeners, requests and asynchronous processing with nested promise trees.
jFactory groups all this together into a component that provides the methods `$install(), $enable(), $disable() and $uninstall()`. Now, you can safely stop, unload or restart the component, making your asynchronous application easier to control and clean.

* [Documentation](https://github.com/jfactory-es/jfactory/tree/master/docs/index.md) / [Traits](https://github.com/jfactory-es/jfactory/tree/master/docs/ref-index.md#traits-component-features) / [Classes](https://github.com/jfactory-es/jfactory/tree/master/docs/ref-index.md#classes-internal-library)
* [Installation](https://github.com/jfactory-es/jfactory/tree/master/docs/ref-import.md) / [Starter Kit](https://github.com/jfactory-es/jfactory-starterkit)
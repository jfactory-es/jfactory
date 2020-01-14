[jFactory](index.md) > [Reference](ref-index.md) > Importing jFactory 

# Importing jFactory

```
npm add jfactory-es
```

See also https://github.com/jfactory-es/jfactory-starterkit

>jFactory should be imported (not loaded from a script tag) into your ES6 project using a bundler that supports [Tree Shaking](https://developer.mozilla.org/docs/Glossary/Tree_shaking), like [Webpack](https://webpack.js.org). 

```javascript
import {jFactory} from "jfactory-es" 
```
>**If this does not work, or does not switch to developer mode when webpack ["mode"](https://webpack.js.org/configuration/mode/) is "development", see below**.
>
> (running in developer mode, you should see a warning in the console)

## Distributions

#### Manual import

If automatic import does not work, manually load one of these modules:

```javascript
// ES6 import
import {jFactory} from "jfactory-es/dist/jFactory-devel.mjs" // development
import {jFactory} from "jfactory-es/dist/jFactory.mjs" // production

// CommonJS import
const {jFactory} = require('jfactory-es/dist/jFactory-devel.cjs') // development
const {jFactory} = require('jfactory-es/dist/jFactory.cjs') // production
```

#### Automatic import  
```javascript
import {jFactory} from "jfactory-es" 
```

Imports the "production" or "development" version, based on the compile time value of `process.env.NODE_ENV`.
>This may require a plugin in your bundler to replace the string `process.env.NODE_ENV` with its current value (in output files before the Tree Shaking is applied).\
> In webpack, this is the default behavior based on the value of ["mode"](https://webpack.js.org/configuration/mode/), but if you are using a developer server or CI, you may want to use the real NODE_ENV while keeping the value of "mode". This can be achieved 
> with the plugin: [`new webpack.EnvironmentPlugin(['NODE_ENV'])`](https://webpack.js.org/plugins/environment-plugin/)
>
>```javascript
>const webpack = require("webpack");
>
>process.env.NODE_ENV = "production";  
>
>module.exports = {
>  mode: "development",
>  entry: {app: "./app.js"},
>  plugins: [
>    new webpack.EnvironmentPlugin(['NODE_ENV']) // ignore the value of "mode"
>  ],
>} 
>```

## External Dependencies

jFactory imports `lodash` and `jQuery`, wich must be defined in the dependencies of the package.json of your application.

But you may want to load these dependency from external sources (CDN, custom object, etc) instead of bundling them into your project.
To do so, you can configure your bundler to exclude these imports:

In webpack:
https://webpack.js.org/configuration/externals/
```javascript
module.exports =  {
    externals: {
        'lodash' : "_",
        'jquery': "jQuery"
    }
}
```

Now webpack will use "_" and "jQuery" global variable instead of importing the modules, so
you can load them from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"
        integrity="sha256-VeNaFBVDhoX3H+gJ37DpT/nTuZTdjYro9yBruHjVmoQ="
        crossorigin="anonymous"></script>
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
        integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8="
        crossorigin="anonymous"></script>
```

## Overriding

jFactory is designed to be easily patchable at runtime (allowing MonkeyPatch, hotfix, hooks, ...)

To safely rewrite the library at runtime (including changing the default configuration), define a temporary global variable `jFactoryOverride = true` before loading anything from jFactory, then call `jFactoryLoader.init()` when your overrides are done.

#### Overriding in ES6

Because ES6 "import" are handled before any other statements, you may need to define `globalThis.jFactoryOverride = true` in a module loaded before jFactory.
 

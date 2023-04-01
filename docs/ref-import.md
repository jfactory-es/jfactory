[jFactory](index.md) > [Reference](ref-index.md) > Importing jFactory 

# Importing jFactory

* [Import from NPM module](#import-from-npm)
* [Import from \<script\>](#import-from-script) for immediate testing
* [Import from Raw source](#import-from-raw-source)

## Production and Development modules

The development version `jFactory-devel.*` provides input validation tests, debug tools, and logs.
In development mode, you must see a startup message in the console.

## Import from \<script\>

**! NOT RECOMMENDED !**\
_Use this form of import for quick library testing. For your projects, it's recommended to use the NPM module to reduce the library's footprint._


```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <!-- loading dependencies from a cdn -->
    <script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery/jquery.min.js"></script>
    <!-- loading jFactory (development) from a cdn -->
    <script src="https://cdn.jsdelivr.net/npm/jfactory@1.7.7/dist/jFactory-devel.umd.js"></script>
</head>
<body>
<script>
    const { jFactory, JFactoryPromise } = jFactoryModule;

    let module = jFactory("myModule", {
        onEnable() {
            this.$log("enable")
        }
    });
    module.$install(true);

    JFactoryPromise.resolve('ok')
        .then(r => console.log(r));
</script>
</body>
</html>
```

## Import from NPM

To minimize the size of your imports, we recommend using a bundler like Webpack with TreeShaking enabled. This will allow you to import only the necessary code and reduce the overall footprint of your project.

To take advantage of these optimizations, the package uses [peer dependencies](https://stackoverflow.com/a/34645112), which you'll need to manually install in your project. By using peer dependencies, you can ensure that your project and jFactory benefits from the same optimized versions of the required dependencies.
Also, plugins like [lodash-webpack-plugin](https://github.com/lodash/lodash-webpack-plugin) can help to reduce the size of lodash.

```
npm add lodash jquery 
npm add jfactory
```

Now you can import the module in your project files:

#### Force a specific import

To force a specific version (development/production), use one of these lines:

```javascript
const { jFactory } = require('jfactory/dist/jFactory.umd.js') // production, umd.js
const { jFactory } = require('jfactory/dist/jFactory-devel.umd.js') // development, umd.js
import { jFactory } from "jfactory/dist/jFactory.mjs" // production, ES6 .mjs
import { jFactory } from "jfactory/dist/jFactory-devel.mjs" // development, ES6 .mjs
```

#### Conditional loading (Automatic import)  

The conditional loading feature enables automatic switching between development and production modules, based on your project's build mode.

```javascript
const { jFactory } = require("jfactory")   
import { jFactory } from "jfactory"  
```

This uses the `process.env.NODE_ENV` to contextually 
import the `production` or the `development` module at compile time.

Note that Weback configures `NODE_ENV` with the value of its [`mode`](https://webpack.js.org/configuration/mode/) 
option, so you shouldn't need to configure anything: your project will automatically use the production module 
if webpack is configured for production.

**Restriction:** Because the "automatic import" is a CommonJS file, it may not work when imported from an ES6 ".mjs" file. 
In this case, you may need to use the [manual import](#nodejs-manual-import) or use a conditionnal ES6 import(). 

<!--
_Additional note_: 

> If you need to force a different "NODE_ENV" by ignoring the webpack "mode" option, this can be achieved 
> with the [`EnvironmentPlugin`](https://webpack.js.org/plugins/environment-plugin/):
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
-->

## Import from raw source

jFactory can also be used from its source files (/src/index.mjs).
```shell
git clone https://github.com/jfactory-es/jfactory
```

```html
<script>
    JFACTORY_ENV_DEV = true // enable developer mode
    // ... see /src/jFactory-env.mjs
</script>
<script type="module" src="src/index.mjs"></script>
```

Or as ES6 import:
```javascript
import { jFactory } from "./src/index.mjs"
```

## See also

* Starter kit: https://github.com/jfactory-es/jfactory-starterkit
* [Overriding](ref-overriding.md)

<!--
## External Dependencies

jFactory imports `lodash` and `jQuery` from its own dependencies.

However you may want to load these dependencies from external sources (CDN, custom object, etc) instead of bundling them into your project.
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
-->

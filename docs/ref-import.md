[jFactory](index.md) > [Reference](ref-index.md) > Importing jFactory 

# Installing jFactory 1.8

* [Import from NPM module](#import-from-npm)
* [Import from \<script\>](#import-from-script) for immediate testing
* [Import from Raw source](#import-from-raw-source)

## Production and Development modules

jFactory provides a development version with additional input validation tests, debug tools, and logs.
When using the development package, you must see a startup message in the console.

## Import from \<script\>

**! NOT RECOMMENDED !**

_The `jFactory.umd.js` file is a fully bundled export. Use this for quick library testing, or on non-bundled websites. For web applications, it is recommended to use the NPM module to reduce the library's footprint with TreeShaking (see the next section)._

```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <!-- loading dependencies from a cdn -->
    <script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery/jquery.min.js"></script>
    <!-- loading jFactory (development) from a cdn -->
    <script src="https://cdn.jsdelivr.net/npm/jfactory@1.8.0/umd/jFactory-devel.umd.js"></script>
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

We recommend using a bundler with TreeShaking enabled, like Webpack in production mode. This will allow you to import only the necessary code from jFactory and dependencies, and reduce the overall footprint of your application.
<!--
To take advantage of these optimizations, the package uses [peer dependencies](https://stackoverflow.com/a/34645112), which you'll need to manually install in your project. By using peer dependencies, you can ensure that your project and jFactory benefits from the same optimized versions of the required dependencies.
Also, plugins like [lodash-webpack-plugin](https://github.com/lodash/lodash-webpack-plugin) can help to reduce the size of lodash.
-->
```
npm add jfactory
```

This package provides ES6 modules optimized for `production` or `development`, 
automatically selected by a conditional loader :  

#### Conditional loading (Automatic import)  

```javascript
import { jFactory } from "jfactory"
```
```javascript
const { jFactory } = require("jfactory") 
```
This [conditional loading](https://github.com/jfactory-es/jfactory/blob/master/es/index.js) is based on `process.env.NODE_ENV` to switch between `development` and `production` modules.

Note that Webpack configures `NODE_ENV` with the value of its [`mode`](https://webpack.js.org/configuration/mode/) 
option, so you shouldn't need to configure anything : Your project will automatically use the production module 
if webpack is configured for production. Otherwise, just set `process.env.NODE_ENV` to `"development"` or `"production"`. 

[//]: # (*Restriction:* Because the "automatic import" is a CommonJS file, it may not work when imported from an ES6 ".mjs" file. )
[//]: # (In this case, you may need to load a specific version &#40;see below&#41; or to load it from a js file. )

#### Force a specific import

To ignore the loader and force a specific version (development or production), use one of these lines :

```javascript
import { jFactory } from "jfactory/es" // production version, ES6
```
```javascript
import { jFactory } from "jfactory/devel" // development version, ES6
```
```javascript
const  { jFactory } = require('jfactory/es') // production loaded with require()
```
```javascript
const  { jFactory } = require('jfactory/devel') // development loaded with require()
```

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

jFactory can also be used from its unbundled source files (/src/index.mjs).
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

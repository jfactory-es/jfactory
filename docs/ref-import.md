[jFactory](index.md) > [Reference](ref-index.md) > Importing jFactory 

# Importing jFactory

## Import as \<script\> 

! NOT THE RECOMMENDED USAGE !\
For immediate testing in html file, the UMD module loads all the library:

```html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <!-- loading dependencies from a cdn -->
    <script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery/jquery.min.js"></script>
    <!-- loading jFactory (development) from a cdn -->
    <script src="https://cdn.jsdelivr.net/npm/jfactory@1.7.4/dist/jFactory-devel.umd.js"></script>
</head>
<body>
<script>
    const { jFactory, JFactoryPromise } = jFactoryModule;

    let module = jFactory("myModule", {
        onEnable() {
            this.$log("enable")
        }
    });
    module.$install(true)

    JFactoryPromise.resolve('ok')
        .then(r => console.log(r))
</script>
</body>
</html>
```

## Import as node_modules (NPM) 

This is the recommended installation because it supports the use of a bundler like Webpack to benefit from TreeShacking.
```
npm add lodash jquery 
npm add jfactory
```

Now you can import the module in your project files:

#### Manual import

You can import a specific module using one of these lines:

```javascript
const { jFactory } = require('jfactory/dist/jFactory.cjs.js') // production
const { jFactory } = require('jfactory/dist/jFactory-devel.cjs.js') // development
import { jFactory } from "jfactory/dist/jFactory.mjs.js" // production
import { jFactory } from "jfactory/dist/jFactory-devel.mjs.js" // development
```

#### Automatic import  

You can import a contextualized module using one of these lines:

```javascript
const { jFactory } = require("jfactory")   
import { jFactory } from "jfactory"  
```

This uses the `process.env.NODE_ENV` and [Tree Shaking](https://webpack.js.org/guides/tree-shaking/) to contextually 
import the `production` or the `development` module at compile time.

Note that if you are using Weback, it configures `NODE_ENV` with the value of its [`mode`](https://webpack.js.org/configuration/mode/) 
option, so you shouldn't need to set it: your project will automatically use the production module 
if webpack is configured for production.

**Restriction:** Because the "automatic import" is a CommonJS file, it may not work when imported from an ES6 ".mjs" file. 
In this case, you may need to use the [manual import](#nodejs-manual-import).

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

## Import as raw source

jFactory can also be used from its source files (/src/index.mjs).
```shell
git clone https://github.com/jfactory-es/jfactory
```

```html
<script>
    JFACTORY_ENV_DEV = true
    // ... see /src/jFactory-env.mjs
</script>
<script type="module" src="src/index.mjs"></script>
<!-- or from a module: import { jFactory } from "./src/index.mjs" -->
```

## Development module

The development version `jFactory-devel.*` provides additional debug tools and logs. 
You must see a log in the console when loaded. If not, see manual import. 

## See also

* Starter kit: https://github.com/jfactory-es/jfactory-starterkit
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
[jFactory](index.md) > [Reference](ref-index.md) > Importing jFactory 

# Importing jFactory

## Import as \<script\> 

! NOT THE RECOMMENDED USAGE !\
For immediate testing in a browser you can use the UMD module from a CDN:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <!-- loading lodash and jquery as global from a cdn -->
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js"
            integrity="sha256-ur/YlHMU96MxHEsy3fHGszZHas7NzH4RQlD4tDVvFhw="
            crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
            integrity="sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs="
            crossorigin="anonymous"></script>
    <!-- loading jFactory from a cdn -->
    <script src="https://cdn.jsdelivr.net/npm/jfactory@latest/dist/jFactory-devel.umd.js"></script>
</head>
<body>
<script>
    const { jFactory } = jFactoryModule;

    let module1 = jFactory("myModule1", {
        onEnable() {
          this.$log("enable")
        }
    });

    let module2 = jFactory("myModule2", {
        onEnable() {
            this.$log("enable")
        }
    });
    
    module1.$install(true)
    module2.$install(true)
</script>
</body>
</html>
```

## Import as node_modules (NPM) 

This is the recommended installation. Use a bundler such as Rollupjs or Webpack. 

```
npm add lodash jquery 
npm add jfactory
```

Now you can import the module in your project files:

#### Manual import

You can manually import a specific build, using one of these lines:

```javascript
// CommonJS syntax: require()
const { jFactory } = require('jfactory/dist/jFactory-devel.cjs') // development
const { jFactory } = require('jfactory/dist/jFactory.cjs') // production
// or
// ES6 syntax: import 
import { jFactory } from "jfactory/dist/jFactory-devel.mjs.js" // development
import { jFactory } from "jfactory/dist/jFactory.mjs.js" // production
```

#### Automatic import  

```javascript
// CommonJS syntax
const { jFactory } = require("jfactory")   
// or
// ES6 syntax (see restriction below)
import { jFactory } from "jfactory"  
```

This uses the `process.env.NODE_ENV` and [Tree Shaking](https://webpack.js.org/guides/tree-shaking/) to contextually 
import the `production` or the `development` module at compile time.
Note that webpack configures `NODE_ENV` with the value of its [`mode`](https://webpack.js.org/configuration/mode/) 
option, so you shouldn't need to set it. 

**Restriction:** Because the "automatic import" is a CommonJS file, it may not work when imported from an ES6 ".mjs" file. 
In this case, you may need to use the [manual import](#nodejs-manual-import), or a transpiler or a bundler.

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
<!-- or import it as ES6 module from a .js file -->
```

## Development module

The development version of the module (jFactory-devel.*) provides debug data and logs. 
You must see a warning in the console when loaded. If not, see Manual import. 

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
## Overriding

jFactory is designed to be patchable at runtime (allowing MonkeyPatch, hotfix, hooks, ...)

To safely rewrite the library at runtime (including changing the default configuration),
you must set a `JFACTORY_ENV_BOOT = false` global variables before loading the module:

#### UMD module (browser usage):

```html
<!--disable jfactory bootstrap-->
<script>JFACTORY_ENV_BOOT = false</script>
<!-- loading jFactory from a cdn -->
<script src="https://cdn.jsdelivr.net/npm/jfactory@latest/dist/jFactory-devel.umd.js"></script>
<script>

    const { jFactory, jFactoryCfg, jFactoryBootstrap } = jFactoryModule;

    // changing the configuration of the class JFactoryTrace:
    jFactoryCfg("JFACTORY_CFG_JFactoryTrace", {
      // ...
    });

    // overriding
    const { JFactoryDOM } = jFactoryModule;
    JFactoryDOM.$dom = function() { /* ... */}

    // call the bootstrap
    jFactoryBootstrap();

</script>
```

#### CommonJS module (node usage, cjs file)

```javascript
// disable jfactory bootstrap
global.JFACTORY_ENV_BOOT = false;

// loading jFactory 
const { jFactory, jFactoryCfg, jFactoryBootstrap } = require("jfactory");

// changing the configuration of the class JFactoryTrace:
jFactoryCfg("JFACTORY_CFG_JFactoryTrace", {
  // ...
});

// overriding
JFactoryDOM.$dom = function() { /* ... */}

// call the bootstrap
jFactoryBootstrap();
```
#### ES6 module (mjs file):

Because ES6 "import" is handled before any other statements, you may need to use separated modules:

```javascript
// env.js
// disable jfactory bootstrap
globalThis.JFACTORY_ENV_BOOT = false;
```

```javascript
// main.js
import "env.js";
import { jFactory, jFactoryCfg, jFactoryBootstrap } from "./jFactory.mjs";

// changing the configuration of the class JFactoryTrace:
jFactoryCfg("JFACTORY_CFG_JFactoryTrace", {
  // ...
});

// overriding
JFactoryDOM.$dom = function() { /* ... */}

// call the bootstrap
jFactoryBootstrap();
````
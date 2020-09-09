[jFactory](index.md) > [Reference](ref-index.md) > Importing jFactory 

# Importing jFactory

### Import as \<script\> 

This is not the recommended usage, but for immediate testing you can use the UMD module from a CDN:

First load the dependencies lodash and jQuery:
```html
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js" 
        integrity="sha256-ur/YlHMU96MxHEsy3fHGszZHas7NzH4RQlD4tDVvFhw=" 
        crossorigin="anonymous"></script>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
        integrity="sha256-4+XzXVhsDmqanXGHaHvgh1gMQKX40OUvDEBTu8JcmNs="
        crossorigin="anonymous"></script>
```
Then load jFactory:

```html
development:
<script src="https://cdn.jsdelivr.net/npm/jfactory@latest/dist/jFactory-devel.umd.js"></script>

or 

production:
<script src="https://cdn.jsdelivr.net/npm/jfactory@latest/dist/jFactory.umd.js"></script> 
```
Finally, initialize it:
```html
const { jFactory } = jFactoryModule; 
```

### Import as NodeJS module (NPM) 

This is the recommended installation in a Node environment.

```
npm add lodash jquery 
npm add jfactory
```

#### NodeJS manual import

You can manually import a specific build, using one of these lines:

```javascript
// NodeJS CommonJS modules
const { jFactory } = require('jfactory/dist/jFactory-devel.cjs') // development
const { jFactory } = require('jfactory/dist/jFactory.cjs') // production

// ES6 modules
import { jFactory } from "jfactory/dist/jFactory-devel.mjs" // development
import { jFactory } from "jfactory/dist/jFactory.mjs" // production
```

#### NodeJS automatic import  

```javascript
// NodeJS CommonJS syntax
const { jFactory } = require("jfactory")   
// or
// ES6 syntax (see restriction below)
import { jFactory } from "jfactory"  
```

This uses the `process.env.NODE_ENV` and [Tree Shaking](https://webpack.js.org/guides/tree-shaking/) to contextually 
import the `production` or the `development` module at compile time.
Note that webpack configures `NODE_ENV` with the value of its [`mode`](https://webpack.js.org/configuration/mode/) 
option, so you shouldn't need to set it. 

**Restriction:** Because the "automatic import" is a CommonJS file, it may not work when imported from a pure es6 environment (.mjs file). 
In this case, you may need to use the [manual import](#nodejs-manual-import) or a commonJS transpiler.  
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
### Development module

The development version of the module (jFactory-devel.*) provides debug data and logs. 
You must see a warning in the console when loaded. If not, see Manual import. 

### See also

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

jFactory is designed to be easily patchable at runtime (allowing MonkeyPatch, hotfix, hooks, ...)

To safely rewrite the library at runtime (including changing the default configuration), define a temporary global variable `jFactoryOverride = true` before loading anything from jFactory, then call `jFactoryBootstrap()` when your overrides are done.
```javascript
jFactoryOverride = true;
const { jFactoryBootstrap } = require("jFactory");
jFactoryBootstrap();
```

#### Overriding in ES6

Because ES6 "import" is handled before any other statements, you may need to define a global (window/global/globalThis) `jFactoryOverride = true` in a module loaded before jFactory.
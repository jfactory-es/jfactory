# Overriding

jFactory is designed to be patchable at runtime (allowing MonkeyPatch, hotfix, hooks, ...)

To safely rewrite the library at runtime (including changing the default configuration),
you must set a `JFACTORY_ENV_BOOT = false` global variables before loading the module:

### UMD module (\<script\>):

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

### CommonJS module (webpack, node usage, cjs file)

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
### ES6 module (mjs file):

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
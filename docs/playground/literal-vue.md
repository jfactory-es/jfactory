[jFactory](../index.md) > [Playground](./README.md) > Literal - Vue  

# Literal - Vue

[Try it on CodePen](https://codepen.io/jfactory-es/pen/GRgzMqx?editors=1010)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>

    <!-- This online demo uses umd modules. This is not optimal, because this loads
         the whole libraries. Instead, you should bundle your project using webpack.
         See https://github.com/jfactory-es/jfactory/blob/master/docs/ref-import.md -->
    
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jfactory@1.4.0/dist/jFactory-devel.umd.js"></script> 
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head> 
<body>
    <h1>The Inaccurate Clock Component - Vue</h1>
    <p>This small component demonstrates how to automatically stop and remove all views,
       queries, promise chains, timers, css and dom, in a single command, using 
       <a target="_blank" href="https://github.com/jfactory-es/jfactory">jFactory</a></p>
    <p>
      <a target="_blank" href="https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md">Documentation</a>      
      <a target="_blank" href="https://github.com/jfactory-es/jfactory/blob/master/docs/playground/README.md">Other demonstrations</a>
    </p>

    <button id="install" onclick="clock.$install()">install</button>
    <button id="enable" onclick="clock.$enable()">enable</button>
    <button id="disable" onclick="clock.$disable()">disable</button>
    <button id="uninstall" onclick="clock.$uninstall()">uninstall</button>

    <template id="tpl-clock"><div class="clock">{{message}}</div></template>
</body>
</html>
```

```javascript
const { jFactory } = jFactoryModule; // loaded as umd, see html.
const assets = "//cdn.jsdelivr.net/gh/jfactory-es/jfactory-starterkit/kit/vue/assets/";

window.clock = jFactory("clock", {

    async onInstall() {
        // Load a css and register it as "clockCss"
        // see https://github.com/jfactory-es/jfactory/blob/master/docs/TraitCSS.md
        await this.$cssFetch("clockCss", assets +  "clock.css");

        // Register a DOM target as "clockDom" with dom id "#clockDom" and append it to "body"
        // see https://github.com/jfactory-es/jfactory/blob/master/docs/TraitDOM.md
        // Clone it from a declared <template> (see index.html file)
        this.$dom("#clockDom", "#tpl-clock", "body");
        // or create it
        // this.$dom("#clockDom", '<div class="clock">{{message}}</div>', "body");
        // or load it
        // await this.$domFetch("#clockDom", assets + "template.html", "body",);

        this.data = { message: "" };
        this.$vue("myVue", new Vue({el: "#clockDom", data: this.data}));

        this.update("Installed but not enabled");
    },
  
    async onEnable() {
        this.update("Fetching...");
        this.date = await this.fetchDate();
        this.$interval("update", 1000, () => {
            this.date = new Date(this.date.setSeconds(this.date.getSeconds() + 1));
            this.update(this.date.toLocaleString())
        })
    },

    onDisable() {
        this.update("Disabled");
        // everything installed by and after onEnable 
        // is automatically stopped and removed
    },

    onUninstall() {
        // everything installed by onInstall 
        // is automatically stopped and removed
    },

    // your own methods...
  
    update(value) {
        this.data.message = value
    },

    fetchDate() {
        return this.$fetchJSON("worldtimeapi", "//worldtimeapi.org/api/ip")
            .then(v => new Date(v.utc_datetime))
    }
});
```
# The Inaccurate Clock Component - Vue

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
    <script src="https://cdn.jsdelivr.net/npm/jfactory@latest/dist/jFactory-devel.umd.js"></script> 
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head> 
<body>
    <h1>The Inaccurate Clock Component - Vue</h1>
    <p>This small component demonstrates how to automatically stop and remove all views,
       queries, promise chains, timers, css and dom, in a single command, using 
       <a target="_blank" href="https://github.com/jfactory-es/jfactory">jFactory</a></p>
    <p>
      <a target="_blank" href="https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md">Documentation</a>      
      <a target="_blank" href="https://github.com/jfactory-es/jfactory/blob/master/docs/index-playground.md">Other demonstrations</a>
    </p>

    <button id="install" onclick="clockComponent.$install()">install</button>
    <button id="enable" onclick="clockComponent.$enable()">enable</button>
    <button id="disable" onclick="clockComponent.$disable()">disable</button>
    <button id="uninstall" onclick="clockComponent.$uninstall()">uninstall</button>

    <template id="tpl-clockVue"><div>{{message}}</div></template>
</body>
</html>
```

```javascript
const { jFactory } = jFactoryModule; // loaded as umd, see html.

window.clockComponent = jFactory("myClockComponent", {

    async onInstall() {
        await this.$cssFetch("#clock-css", "//cdn.jsdelivr.net/gh/jfactory-es/jfactory-starterkit/assets/app-clock.css");

        // Create a DOM target for the view
        // using an existing <template> and append it to the <body>
        this.$dom("#clock-view", "#tpl-clockVue", "body");
        // or create it
        // this.$dom("#clock-view", '<div>{{message}}</div>', "body");
        // or load it
        // await this.$domFetch("#clock-view", "//cdn.jsdelivr.net/gh/jfactory-es/jfactory-starterkit/assets/app-clock.tpl.html", "body");

        this.data = {message: ""};
        this.$vue("myView", new Vue({el: "#clock-view", data: this.data}));
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
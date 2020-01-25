# The Inaccurate Clock Component - Vanilla

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
</head> 
<body>
    <h1>The Inaccurate Clock Component - Vanilla</h1>
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
</body>
</html>
```

```javascript
const { jFactory } = jFactoryModule; // loaded as umd, see html.

window.clockComponent = jFactory("myClockComponent", {

    onInstall() {
        this.view = this.$dom("#clock-view", "<div>").appendTo("body");
        this.$cssFetch("#clock-css", "//cdn.jsdelivr.net/gh/jfactory-es/jfactory-starterkit/assets/app-clock.css")
          .then(() => this.updateView("installed but not enabled"));
    },

    async onEnable() {
        this.updateView("fetching...");
        this.date = await this.fetchDate();
        this.$interval("update", 1000, () => {
            this.date = new Date(this.date.setSeconds(this.date.getSeconds() + 1));
            this.updateView(this.date.toLocaleString())
        })
    },

    onDisable() {
        this.updateView("disabled");
        // everything installed by and after onEnable 
        // is automatically stopped and removed
    },

    onUninstall() {
        // everything installed by onInstall 
        // is automatically stopped and removed
    },

    // your own methods...
  
    updateView(value) {
        this.view.html(value)
    },

    fetchDate() {
        return this.$fetchJSON("worldtimeapi", "//worldtimeapi.org/api/ip")
            .then(v => new Date(v.utc_datetime))
    }
});
```
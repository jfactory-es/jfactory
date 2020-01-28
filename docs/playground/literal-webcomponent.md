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
</head> 
<body>
    <h1>The Inaccurate Clock Component - Web Component</h1>
    <p>This small component demonstrates how to automatically stop and remove all views,
       queries, promise chains, timers, css and dom, in a single command, using 
       <a target="_blank" href="https://github.com/jfactory-es/jfactory">jFactory</a></p>
    <p>
      <a target="_blank" href="https://github.com/jfactory-es/jfactory/blob/master/docs/ref-index.md">Documentation</a>      
      <a target="_blank" href="https://github.com/jfactory-es/jfactory/blob/master/docs/playground/README.md">Other demonstrations</a>
    </p>

    <button id="install" onclick="clockComponent.$install()">install</button>
    <button id="enable" onclick="clockComponent.$enable()">enable</button>
    <button id="disable" onclick="clockComponent.$disable()">disable</button>
    <button id="uninstall" onclick="clockComponent.$uninstall()">uninstall</button>

    <template id="tpl-vanilla"><div class="clock"/></template>
</body>
</html>
```

```javascript
const { jFactory } = jFactoryModule; // loaded as umd, see html.

class ClockComponent extends HTMLElement {

    constructor() {
        super();

        // Inject jFactory Traits using shortcuts
        // see https://github.com/jfactory-es/jfactory/blob/master/src/jFactory.mjs
        JFactoryCoreObject.inject(this, ClockComponent, this.getAttribute("name"));
        JFactoryComponent.inject(this, ClockComponent);

        // Init the shadowRoot property
        // see https://developer.mozilla.org/docs/Web/API/ShadowRoot
        this.attachShadow({mode: 'open'});
    }

    async onInstall() {
        this.$log("install");

        // Load a css and register it as "clockCss"
        // see https://github.com/jfactory-es/jfactory/blob/master/docs/TraitCSS.md
        await this.$cssFetch("clockCss", "assets/clock.css", this.shadowRoot);

        // Register a DOM target as "clockDom" and append it to "body"
        // see https://github.com/jfactory-es/jfactory/blob/master/docs/TraitDOM.md
        // Clone it from a declared <template> (see index.html file)
        this.view = this.$dom("clockDom", "#tpl-vanilla", this.shadowRoot);
        // or create it
        // this.view = this.$dom("clockDom", '<div class="clock"/>', this.shadowRoot);
        // or load it
        // this.view = await this.$domFetch("clockDom", "../assets/tpl-vanilla.html", this.shadowRoot);

        this.updateView("Installed but not enabled");
    }

    async onEnable() {
        this.$log("enable");
        this.updateView("Fetching...");
        this.date = await this.fetchDate();
        this.$interval("update", 1000, () => {
            this.date = new Date(this.date.setSeconds(this.date.getSeconds() + 1));
            this.updateView(this.date.toLocaleString())
        })
    }

    onDisable() {
        this.$log("disable");
        this.updateView("Disabled");
        // everything installed by and after onEnable
        // is automatically stopped and removed
    }

    onUninstall() {
        this.$log("uninstall");
        // everything installed by onInstall
        // is automatically stopped and removed
    }

    // your own methods...

    updateView(value) {
        this.view.html(value)
    }

    fetchDate() {
        return this.$fetchJSON("worldtimeapi", "//worldtimeapi.org/api/ip")
            .then(v => new Date(v.utc_datetime))
    }
}

// Register the ClockComponent as a Web Component
customElements.define('clock-component', ClockComponent);

$(() => {// Wait for document load
    window.clock = $('<clock-component name="clock"/>').appendTo("body")[0];
});

```
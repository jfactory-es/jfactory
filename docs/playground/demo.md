[jFactory](../index.md) > [Playground](./README.md) > Main Demonstration  

# Main Demonstration - Instantiated Components

[Try it on CodePen](https://codepen.io/jfactory-es/pen/qBddLVB?editors=1010)

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
    <script src="https://cdn.jsdelivr.net/npm/jfactory@1.5.0/dist/jFactory-devel.umd.js"></script> 
</head> 
<body>
  
    <div id="root">
        <button id="root-bt-install">Install Main Component</button>
        <button id="root-bt-uninstall">Uninstall Main Component</button>
    </div>
    
    <div style="font-size:0.9em;font-family: sans-serif;">  
        <p>Here is how to control components from a master component. You can create as many instances of "Clock" as you want, stop them individually, or ask the parent component to disable/enable them all.</p>
        <p>Since the master component is unique, it is created from a literal object, while Clock components are created from a JavaScript class.</p>
        <p>Clock components load css, manipulate dom, install listeners, perform queries, and use timers and promises. Everything is stopped and removed automatically on demand by <a target="_blank" href="https://github.com/jfactory-es/jfactory">jFactory</a>, making the application easier to control and clean.</p>
    </div>
    
    <template id="tpl-main">
        <div id="main">
            <div id="main-title">Main Component</div>
            <button id="main-bt-enable">enable</button>
            <button id="main-bt-disable">disable</button>
            <button id="main-bt-add">add Clock Component</button>
            <div id="main-clocks"></div>
        </div>
    </template>
    
    <template id="tpl-clock">
        <div class="clock">
            <div class="clock-view"></div>
            <div class="clock-bts">
                <button class="clock-bt-enable">enable</button>
                <button class="clock-bt-disable">disable</button>
                <button class="clock-bt-remove">remove</button>
            </div>
        </div>
    </template>

</body>
</html>
```

```javascript
const { jFactory, JFactoryComponent } = jFactoryModule; // loaded as umd, see html.
const assets = "//cdn.jsdelivr.net/gh/jfactory-es/jfactory-starterkit@latest/kit/class/assets/";

window.app = {};

const REQUEST_DELAY = 2000;

app.mainComponent = jFactory("main", {

    async onInstall() {
        this.$log("install");

        $("#root-bt-install").attr("disabled", true);
        $("#root-bt-uninstall").attr("disabled", false);

        await this.$cssFetch("main", assets + "main.css");
        this.$dom("main", "#tpl-main", "body");
        this.$on("click", "#main-bt-disable", () => this.$disable());
        this.$on("click", "#main-bt-enable", () => this.$enable());

        this.clocks = [];
    },

    async onEnable() {
        this.$log("enable");

        $("#main-bt-enable").attr("disabled", true);
        $("#main-bt-disable").attr("disabled", false);
        $("#main-bt-add").attr("disabled", false);

        this.$on("click", "#main-bt-add", () => this.addClock());

        for (let id of this.clocks.keys()) {
            this.clocks[id] && this.clocks[id].$install(true)
        }
    },

    onDisable() {
        this.$log("disable");

        $("#main-bt-enable").attr("disabled", false);
        $("#main-bt-disable").attr("disabled", true);
        $("#main-bt-add").attr("disabled", true);

        for (let id of this.clocks.keys()) {
            this.clocks[id] && this.clocks[id].$uninstall()
        }
    },

    onUninstall() {
        this.$log("uninstall");
        $("#root-bt-install").attr("disabled", false);
        $("#root-bt-uninstall").attr("disabled", true);

        // Because uninstall calls disable,
        // we don't need to uninstall the clocks
        this.clocks = [];
    },

    addClock() {
        let id = this.clocks.length;
        let name = "clock_" + id;
        let clock = this.clocks[id] = new ClockComponent(name);
        clock.$install(true);
    },

    async removeClock(id) {
        let clock = this.clocks[id];
        await clock.$uninstall();
        delete this.clocks[id]
    }
});

class ClockComponent extends JFactoryComponent {

    async onInstall() {
        this.$log("install");

        this.id = this.$.about.name.split('_')[1];
        this.domSelector = "#" + this.$.about.name;

        await this.$cssFetch("clockCss", assets + "clock.css");
        this.container = this.$dom(this.domSelector, "#tpl-clock", "#main-clocks");
        this.view = this.container.find(".clock-view");
        this.$on("click", this.domSelector + " .clock-bt-enable", () => this.$enable());
        this.$on("click", this.domSelector + " .clock-bt-disable", () => this.$disable());
        this.$on("click", this.domSelector + " .clock-bt-remove", () => app.mainComponent.removeClock(this.id)
        );

        this.updateView("Installed but not enabled");
    }

    async onEnable() {
        this.$log("enable");

        this.container.find(".clock-bt-enable").attr("disabled", true);
        this.container.find(".clock-bt-disable").attr("disabled", false);

        this.date = await this.fetchDate();
        // this.updateView(this.date.toLocaleString());
        this.updateView("Fetched");

        this.$interval("update", 1000, () => {
            this.date = new Date(this.date.setSeconds(this.date.getSeconds() + 1));
            this.updateView(this.date.toLocaleString())
        })
    }

    onDisable() {
        this.$log("disable");

        this.container.find(".clock-bt-enable").attr("disabled", false);
        this.container.find(".clock-bt-disable").attr("disabled", true);

        this.updateView("Disabled");
    }

    onUninstall() {
        this.$log("uninstall");
    }

    updateView(value) {
        this.view.html(value)
    }

    fetchDate() {
        return new Promise(resolve => {
            let now = Date.now();
            let d = REQUEST_DELAY - (now - ClockComponent.lastFetch);
            if (d > 0) {
                // Defer the request to avoid spamming
                this.updateView("Delaying...");
                this.$timeout(now+'_'+d.toString(), d, () => this.fetchDate().then(resolve))
            } else {
                this.updateView("Fetching...");
                ClockComponent.lastFetch = now;
                resolve(this.$fetchJSON("fetchDate", "//worldtimeapi.org/api/ip")
                    .then(v => new Date(v.utc_datetime)))
            }
        });
    }
}

$(document).ready(() => {
    $("#root-bt-install").on("click", () => app.mainComponent.$install(true));
    $("#root-bt-uninstall").on("click", () => app.mainComponent.$uninstall());
    app.mainComponent.$install(true)
});
```
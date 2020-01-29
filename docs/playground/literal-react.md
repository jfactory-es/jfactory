[jFactory](../index.md) > [Playground](./README.md) > Literal - React  

# Literal - React

[Try it on CodePen](https://codepen.io/jfactory-es/pen/WNbmooa?editors=1010)

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
    <script src="https://unpkg.com/react/umd/react.development.js"></script> 
    <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script> 
</head> 
<body>
    <h1>The Inaccurate Clock Component - React</h1>
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

    <template id="tpl-clock"><div class="clock"/></template>
</body>
</html>
```

```jsx harmony
const { jFactory } = jFactoryModule; // loaded as umd, see html.
const assets = "//cdn.jsdelivr.net/gh/jfactory-es/jfactory-starterkit/kit/react/assets/";

jFactory.ReactDOM = ReactDOM;

window.clock = jFactory("clock", {

  async onInstall() {
    
       class Clock extends React.Component {
            constructor(props) {
                super(props);
                this.state = { message: "" };
            }
            render() {return this.state.message}
        }

        // Load a css and register it as "clockCss"
        // see https://github.com/jfactory-es/jfactory/blob/master/docs/TraitCSS.md
        await this.$cssFetch("clockCss", assets + "clock.css");

        // Register a DOM target as "clockDom" and append it to "body"
        // see https://github.com/jfactory-es/jfactory/blob/master/docs/TraitDOM.md
        // Clone it from a declared <template> (see index.html file)
        let clockDom = this.$dom("clockDom", "#tpl-clock", "body");
        // or create it
        // let clockDom = this.$dom("clockDom", "<div class='clock'/>", "body");
        // or load it
        // let clockDom = await this.$domFetch("clockDom", assets + "template.html", "body",);
        this.view = this.$react("myView", clockDom, <Clock />);

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
    // Everything installed by and after onEnable
    // is automatically stopped and removed
  },

  onUninstall() {
    // Everything installed by onInstall
    // is automatically stopped and removed
  },

  // your own methods...

  update(value) {
    this.view.setState({message: value});
  },

  fetchDate() {
    return this.$fetchJSON("worldtimeapi", "//worldtimeapi.org/api/ip")
      .then(v => new Date(v.utc_datetime))
  }
});
```
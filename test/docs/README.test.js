const { wait, expect } = require("../../scripts/dev/test-utils");
const $ = require("jquery");

// ---------------------------------------------------------------------------------------------------------------------
// README
// ---------------------------------------------------------------------------------------------------------------------

const { jFactory } = require("../../dist");

describe("ex1", async function() {
  let component = jFactory("myComponent", {

    onInstall() {
      // create, insert and register a DOM container
      // (jFactory can also use templates, vue and react, load assets, etc)
      this.$dom("#containerDiv", '<div>', "body")
        .append(
          '<button id="bt-switch">switch</button>' +
          '<button id="bt-close">close</button>');

      // load a CSS asynchronously
      this.$cssFetch("myCss", "asset.css");

      this.$on("click", "#bt-switch", () => this.mySwitchHandler());
      this.$on("click", "#bt-close", () => this.myCloseHandler());
    },

    onEnable() {
      this.$interval("myUpdater", 1000, () =>
        this.$fetchJSON("myRequest", "asset.json")
          .then(data => this.$log("updated", data))
      );
    },

    async mySwitchHandler() {
      await (this.$.states.enabled ? this.$disable() : this.$enable());
      this.$log(this.$.states.enabled);
    },

    myCloseHandler() {
      // stop and remove:
      // dom container, css, listeners, interval, fetch, promise...
      this.$uninstall();
    }
  })

  // install and enable the component
  await component.$install(true);
});

const {wait} = require("../../scripts/dev/test-utils");
const $ = require("jquery");

const { jFactory } = require("../../dist");

describe("README.md", function() {

  it("#1", function() {

    let component = jFactory("whatsNewComponent", {
      onInstall() {
        this.$cssFetch("#whatsnew-css", "asset.css");
        this.$domFetch("#whatsnew-div", "asset.html")
          .then(dom => dom.appendTo("body"));
        this.$task("watsNew-init", new Promise(resolve => wait(500).then(resolve)))
          .then(() => this.$log('init sub task done.'))
      },

      onEnable() {
        let count = 0;
        this.$on("pointerdown", "#whatsnew-div", () => this.$log('click!'));
        this.$interval("updateNews", 250, () =>
          this.$fetchJSON("getNews", "asset.json")
            .then(() => this.$log("updated", ++count))
        )
      }
    });

    (async function() {
      await component.$install(); // await onInstall()
      await component.$enable(); // await onEnable()
      await wait(1000);
      await component.$disable(); // stop/remove everything started during and after onEnable()
      component.$enable(); // restarting in background...
      component.$disable(); // ... abort restart and disable
      await wait(1000);
      await component.$uninstall(); // stop and clean the component
    })();
  });

});
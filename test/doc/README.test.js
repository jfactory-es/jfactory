require("../../scripts/dev/test-utils");
const $ = require("jquery");

const { jFactory } = require("../../dist");

describe("README.md", function() {

  it("#1", function() {

    let component = jFactory("WhatsNewComponent", {
      onInstall() {
        this.$cssFetch("#whatsnew-css", "asset.css");
        this.$domFetch("#whatsnew-div", "asset.html")
          .then(dom => dom.hide().appendTo("body")) // jQuery
      },

      onEnable() {
        this.$on("click", "#whatsnew", ".button", () => this.$log("click!"));
        this.$fetchText("news", "asset.html")
          .then(html => $("#whatsnew").html(html).show()) // jQuery
      },

      onDisable() {
        $("#panel").hide()
      }, // jQuery

      // -- custom methods ---

      async somethingAsync() {
        this.$fetchJSON("myLoader", "asset.json")
          .then(data => this.$log("data:", data));
        this.$task("myTask1", Promise.resolve(123))
          .then(() => this.$log("done1"));
        this.$task("myTask2", async resolve => setTimeout(resolve, 0))
          .then(() => this.$log("done2"))
      }
    });

    (async function () {
      await component.$install(true); // await everything in onInstall, then await everything in onEnable()
      component.somethingAsync(); // start async tasks in background
      await component.$disable(); // stop/remove everything started during and after $enable()
      await component.$enable(); // await everything in onEnable()
      component.somethingAsync(); // start async tasks in background
      await component.$uninstall(); // stop/remove all
    }());
  });

});
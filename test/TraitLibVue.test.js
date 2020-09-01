const { wait, expect } = require("../scripts/dev/test-utils");
const $ = require("jquery");
const Vue =require("vue/dist/vue.min");

// ---------------------------------------------------------------------------------------------------------------------
// TraitDOM Test
// ---------------------------------------------------------------------------------------------------------------------

const { jFactory } = require("../dist");

describe("Trait Vue", function() {

    it("should register and remove vuejs", async function() {
        let component = jFactory("component", {
            onInstall() {
                $('<div id="dom1">{{txt}}</div>').appendTo("body");
                this.data = {txt: "0"};
                let a = this.$vue("vue1", new Vue({
                    el: "#dom1",
                    data: this.data
                }));
            },
            onEnable() {
                this.data.txt = 1;
            }
        });

        await component.$install();
        expect($("#dom1").text()).equal("0");
        await component.$enable();
        expect($("#dom1").text()).equal("1");
        await component.$uninstall();
        expect($("#dom1").length).equal(0);

        await component.$install();
        expect($("#dom1").text()).equal("0");
        await component.$enable();
        expect($("#dom1").text()).equal("1");
        await component.$uninstall();
        expect($("#dom1").length).equal(0);

    });
});


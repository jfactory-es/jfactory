const { wait, expect } = require("../scripts/dev/test-utils");
const $ = require("jquery");

// ---------------------------------------------------------------------------------------------------------------------
// TraitCSS Test
// ---------------------------------------------------------------------------------------------------------------------

const { jFactory, jFactoryError, JFactoryPromise } = require("../dist");

describe("Trait CSS", function() {

    beforeEach(function() {
        $('<div id="dom1" class="jFactory-test">').appendTo("body");
    });

    afterEach(function() {
        $(".jFactory-test, .jFactory-css").remove();
    });

    it("should css", async function() {
        let dom1 = $("#dom1");
        let component = jFactory("component");
        component.$install(true);
        component.$css("n1", "#dom1{border:1px solid black}");
        expect(dom1.css("border-bottom-width")).equal("1px");
        component.$uninstall();
    });

    it("should cssFetch", async function() {
        let dom1 = $("#dom1");
        let component = jFactory("component");
        component.$install(true);
        await component.$cssFetch("n1", "asset.css");
        expect(dom1.css("visibility")).equal("hidden");
        component.$uninstall();
    });

    it("should return jQuery", async function() {
        let component = jFactory("component");
        component.$install(true);
        expect(component.$css("n1", "#dom1{border:1px solid black}")).instanceof($);
        expect(await component.$cssFetch("n2", "asset.css")).instanceof($);
        component.$uninstall();
    });

    it("should task", async function() {
        let component = jFactory("component");
        component.$install(true);
        component.$cssFetch("n1", "asset.css");
        expect(component.$.tasks.has('$cssFetch("n1")')).equal(true);
        component.$uninstall();
    });

    it("should phase", async function() {
        let component = jFactory("component", {
            onInstall() {
                this.$cssFetch("n1", "asset.css")
                    .then(r => wait(10).then(() => r))
                    .then(r => this.n1 = r)
            },
            onEnable() {
                this.pass = this.n1 instanceof $;
                this.n2 = this.$cssFetch("n2", "asset.css")
                    .then(r => wait(10).then(() => r))
                    .then(r => this.n2 = r)
            }
        });
        await component.$install(true);
        expect(component.pass).equal(true);
        expect(component.n2).instanceof($);
        component.$uninstall();
    });

    it("should register", async function() {
        let dom1 = $("#dom1");
        let component = jFactory("component");
        component.$install(true);
        component.$css("n1", "#dom1{border:1px solid black}");
        await component.$cssFetch("n2", "asset.css");
        expect(component.$.css.has("n1")).equal(true);
        expect(component.$.css.has("n2")).equal(true);
        expect(dom1.css("border-bottom-width")).equal("1px");
        expect(dom1.css("visibility")).equal("hidden");
        component.$uninstall();
    });

    it("should unregister", async function() {
        let component = jFactory("component");
        component.$install(true);
        component.$css("n1", "#dom1{border:1px solid black}");
        await component.$cssFetch("n2", "asset.css");
        component.$cssRemove("n1");
        component.$cssRemove("n2");
        expect(component.$.css.has("n1")).equal(false);
        expect(component.$.css.has("n2")).equal(false);
        expect($(".jFactory-css").length).equal(0);
        component.$uninstall();
    });

    it("should unregister all", async function() {
        let component = jFactory("component");
        component.$install(true);
        component.$css("n1", "#dom1{border:1px solid black}");
        await component.$cssFetch("n2", "asset.css");
        component.$cssRemoveAll(jFactory.PHASE.DISABLE);
        expect(component.$.css.has("n1")).equal(false);
        expect(component.$.css.has("n2")).equal(false);
        expect($(".jFactory-css").length).equal(0);
        component.$uninstall();
    });

    it("should clean up", async function() {
        let component = jFactory("component");
        component.$install(true);
        component.$css("n1", "#dom1{border:1px solid black}");
        component.$cssFetch("n2", "asset.css"); // no await
        expect($(".jFactory-css").length).equal(2);
        component.$cssRemove("n1");
        component.$cssRemove("n2");
        await wait(10); // load
        expect($(".jFactory-css").length).equal(0);
        component.$uninstall();
    });

    it("should not unregister on chain complete", async function() {
        let component = jFactory("component");
        component.$install(true);
        let n1 = component
            .$cssFetch("n1", "asset.css");
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.css.get("n1")).instanceof(JFactoryPromise);
        await n11;
        expect(component.$.css.has("n1")).equal(true);
        component.$uninstall();
    });

    it("should unregister task on chain complete", async function() {
        let component = jFactory("component");
        component.$install(true);
        let n1 = component
            .$cssFetch("n1", "asset.css");
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.tasks.get('$cssFetch("n1")')).instanceof(JFactoryPromise);
        await n11;
        expect(component.$.tasks.has('$cssFetch("n1")')).equal(false);
        component.$uninstall();
    });

    it("should chainAbort", async function() {
        let component = jFactory("component");
        component.$install(true);
        let n1 = component
            .$cssFetch("n1", "asset.css")
            .then(r => wait(1).then(() => r))
            .$chainAbort();
        expect(component.$.tasks.has('$cssFetch("n1")')).equal(false);
        expect(component.$.css.has("n1")).equal(true); // SPEC: the entry is not auto removed
        try {
            await n1
        } catch (e) {
            expect(e).instanceof(jFactoryError.PROMISE_EXPIRED);
        }
        component.$uninstall();
    });

    // ---

    it("should set dom id", async function() {
        let component = jFactory("component");
        component.$install(true);

        // don't set id if not prefixed with "#"
        component.$css("css1", "#dom1{border:1px solid black}");
        expect($("#css1").length).equal(0);
        component.$cssRemove("css1");
        $(".jFactory-css").remove();

        // set id if prefixed with "#"
        component.$css("#css1", "#dom1{border:1px solid black}");
        expect($("#css1").length).equal(1);
        expect(component.$.css.has("css1")).equal(true);
        component.$cssRemove("css1");
        expect($("#css1").length).equal(0);
        $(".jFactory-test").remove();

        component.$uninstall()
    });
});
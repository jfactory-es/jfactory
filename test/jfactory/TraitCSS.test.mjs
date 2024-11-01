// ---------------------------------------------------------------------------------------------------------------------
// TraitCSS Test
// ---------------------------------------------------------------------------------------------------------------------

import {
    jFactoryModule,
    jQuery as $,
    describe, it, expect, afterEach, beforeEach,
    wait
} from "../../scripts/test/test-import.mjs";

const {
    jFactory,
    JFactoryPromise,
    JFACTORY_ERR_PROMISE_EXPIRED
} = jFactoryModule;

describe("Trait CSS", function() {

    beforeEach(function() {
        $('<div id="dom1">').appendTo("body");
    });

    afterEach(function() {
        $("#dom1").remove();
    });

    it("should css", async function() {
        let dom1 = $("#dom1");
        let component = jFactory("component");
        await component.$install(true);
        component.$css("#n1", "#dom1{border:1px solid black}");
        expect(dom1.css("border-bottom-width")).equal("1px");
        await component.$uninstall();
        expect($("#n1").length).equal(0)
    });

    it("should cssFetch", async function() {
        let dom1 = $("#dom1");
        let component = jFactory("component");
        await component.$install(true);
        await component.$cssFetch("#n1", "https://api.test.local/asset.css");
        expect(dom1.css("visibility")).equal("hidden");
        await component.$uninstall();
        expect($("#n1").length).equal(0)
    });

    it("should return jQuery", async function() {
        let component = jFactory("component");
        await component.$install(true);
        expect(component.$css("#n1", "#dom1{border:1px solid black}")).instanceof($);
        expect(await component.$cssFetch("#n2", "https://api.test.local/asset.css")).instanceof($);
        await component.$uninstall();
        expect($("#n1").length).equal(0);
        expect($("#n2").length).equal(0)
    });

    it("should task", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$cssFetch("#n1", "https://api.test.local/asset.css");
        expect(component.$.tasks.has('$cssFetch("n1")')).equal(true);
        await component.$uninstall();
        expect($("#n1").length).equal(0);
    });

    it("should phase", async function() {
        let component = jFactory("component", {
            onInstall() {
                this.$cssFetch("#n1", "https://api.test.local/asset.css")
                    .then(r => wait(10).then(() => r))
                    .then(r => this.n1 = r)
            },
            onEnable() {
                this.pass = this.n1 instanceof $;
                this.n2 = this.$cssFetch("#n2", "https://api.test.local/asset.css")
                    .then(r => wait(10).then(() => r))
                    .then(r => this.n2 = r)
            }
        });
        await component.$install(true);
        expect(component.pass).equal(true);
        expect(component.n2).instanceof($);
        await component.$uninstall();
        expect($("#n1").length).equal(0);
        expect($("#n2").length).equal(0)
    });

    it("should register", async function() {
        let dom1 = $("#dom1");
        let component = jFactory("component");
        await component.$install(true);
        component.$css("#n1", "#dom1{border:1px solid black}");
        await component.$cssFetch("#n2", "https://api.test.local/asset.css");
        expect(component.$.css.has("n1")).equal(true);
        expect(component.$.css.has("n2")).equal(true);
        expect(dom1.css("border-bottom-width")).equal("1px");
        expect(dom1.css("visibility")).equal("hidden");
        await component.$uninstall();
        expect($("#n1").length).equal(0);
        expect($("#n2").length).equal(0)
    });

    it("should unregister", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$css("#n1", "#dom1{border:1px solid black}");
        await component.$cssFetch("#n2", "https://api.test.local/asset.css");
        component.$cssRemove("n1");
        component.$cssRemove("n2");
        expect(component.$.css.has("n1")).equal(false);
        expect(component.$.css.has("n2")).equal(false);
        expect($(".jFactory-css").length).equal(0);
        await component.$uninstall();
        expect($("#n1").length).equal(0);
        expect($("#n2").length).equal(0)
    });

    it("should unregister all", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$css("#n1", "#dom1{border:1px solid black}");
        await component.$cssFetch("#n2", "https://api.test.local/asset.css");
        component.$cssRemoveAll(jFactory.PHASE.DISABLE);
        expect(component.$.css.has("n1")).equal(false);
        expect(component.$.css.has("n2")).equal(false);
        expect($(".jFactory-css").length).equal(0);
        await component.$uninstall();
        expect($("#n1").length).equal(0);
        expect($("#n2").length).equal(0)
    });

    it("should clean up", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$css("#n1", "#dom1{border:1px solid black}");
        await component.$cssFetch("#n2", "https://api.test.local/asset.css"); // no await
        expect($('#n1').length).equal(1);
        expect($('#n2').length).equal(1);
        component.$cssRemove("n1");
        component.$cssRemove("n2");
        expect($('#n1').length).equal(0);
        expect($('#n2').length).equal(0);
        await component.$uninstall();
        expect($("#n1").length).equal(0);
        expect($("#n2").length).equal(0)
    });

    it("should not unregister on chain complete", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$cssFetch("#n1", "https://api.test.local/asset.css");
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.css.get("n1")).instanceof(JFactoryPromise);
        await n11;
        expect(component.$.css.has("n1")).equal(true);
        await component.$uninstall();
        expect($("#n1").length).equal(0);
    });

    it("should unregister task on chain complete", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$cssFetch("#n1", "https://api.test.local/asset.css");
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.tasks.get('$cssFetch("n1")')).instanceof(JFactoryPromise);
        await n11;
        expect(component.$.tasks.has('$cssFetch("n1")')).equal(false);
        await component.$uninstall();
        expect($("#n1").length).equal(0);
    });

    it("should chainAbort", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$cssFetch("#n1", "https://api.test.local/asset.css")
            .then(r => wait(1)).then(() => {debugger})
            .$chainAbort();
        expect(component.$.tasks.has('$cssFetch("n1")')).equal(false);
        expect(component.$.css.has("n1")).equal(true); // SPEC: the entry is not auto removed
        try {
            await n1
        } catch (e) {
            expect(e).instanceof(JFACTORY_ERR_PROMISE_EXPIRED);
        }
        await component.$uninstall();
        expect($("#n1").length).equal(0);
    });

    // ---

    it("should set dom id", async function() {
        let component = jFactory("component");
        await component.$install(true);

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

        await component.$uninstall();
        expect($("#css1").length).equal(0);
    })
});
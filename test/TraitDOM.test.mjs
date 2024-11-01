// ---------------------------------------------------------------------------------------------------------------------
// TraitDOM Test
// ---------------------------------------------------------------------------------------------------------------------

import {
    jFactoryModule,
    jQuery as $,
    describe, it, expect, afterEach,
    wait
} from "../scripts/test/test-import.mjs";

const {
    jFactory,
    JFactoryFetch,
    JFactoryPromise,
    JFACTORY_ERR_PROMISE_EXPIRED
} = jFactoryModule;

describe("Trait DOM", function() {

    afterEach(function() {
        $(".jFactory-test, .jFactory-css").remove();
    });

    it("should dom", async function() {
        let component = jFactory("component");
        await component.$install(true);
        expect(component.$dom("n1", "<p><div>")[1]).instanceof(HTMLDivElement); // jQuery string selector
        expect(component.$dom("n2", $("<p><div>"))[1]).instanceof(HTMLDivElement); // jQuery selection
        expect(component.$dom("n3", document.createElement("div"))[0]).instanceof(HTMLDivElement); // HTMLElement
        // expect(component.$dom("n4", [document.createElement("div"), document.createElement("div")])[1]) // array
        //     .instanceof(HTMLDivElement); // HTMLElement
        component.$uninstall();
    });

    it("should domFetch", async function() {
        let component = jFactory("component");
        await component.$install(true);
        expect((await component.$domFetch("n1", "https://api.test.local/asset.html"))[0]).instanceof(HTMLParagraphElement);
        component.$uninstall();
    });

    it("should return jQuery", async function() {
        let component = jFactory("component");
        await component.$install(true);
        expect(component.$dom("n1", "<p><div>")).instanceof($); // jQuery string selector
        expect(component.$dom("n2", $("<p><div>"))).instanceof($); // jQuery selection
        expect(component.$dom("n3", document.createElement("div"))).instanceof($); // HTMLElement
        // expect(component.$dom("n4", $([document.createElement("div"), document.createElement("div")]))) // array
        //     .instanceof($); // HTMLElement
        expect(await component.$domFetch("n5", "https://api.test.local/asset.html")).instanceof($);
        component.$uninstall();
    });

    it("should task", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$domFetch("n1", "https://api.test.local/asset.html");
        expect(component.$.tasks.has('$domFetch("n1")')).equal(true);
        component.$uninstall();
    });

    it("should phase", async function() {
        let component = jFactory("component", {
            onInstall() {
                this.$domFetch("n1", "https://api.test.local/asset.html")
                    .then(r => wait(10).then(() => r))
                    .then(r => this.n1 = r)
            },
            onEnable() {
                this.pass = this.n1 instanceof $;
                this.n2 = this.$domFetch("n2", "https://api.test.local/asset.html")
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
        let component = jFactory("component");
        await component.$install(true);
        component.$dom("n1", "<div>");
        component.$domFetch("n2", "https://api.test.local/asset.html");
        expect(component.$.dom.has("n1")).equal(true);
        expect(component.$.dom.has("n2")).equal(true);
        component.$uninstall();
    });

    it("should unregister", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$dom("n1", '<div class="jFactory-test">').appendTo("body");
        await component.$domFetch("n2", "https://api.test.local/asset.html").then(r => r.appendTo("body"));
        expect($(".jFactory-test").length).equal(2);
        component.$domRemove("n1");
        component.$domRemove("n2");
        expect(component.$.dom.has("n1")).equal(false);
        expect(component.$.dom.has("n2")).equal(false);
        expect($(".jFactory-test").length).equal(0);
        component.$uninstall();
    });

    it("should unregister all", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$dom("n1", '<div class="jFactory-test">').appendTo("body");
        await component.$domFetch("n2", "https://api.test.local/asset.html").then(r => r.appendTo("body"));
        expect($(".jFactory-test").length).equal(2);
        component.$domRemoveAll(jFactory.PHASE.DISABLE);
        expect(component.$.dom.has("n1")).equal(false);
        expect(component.$.dom.has("n2")).equal(false);
        expect($(".jFactory-test").length).equal(0);
        component.$uninstall();
    });

    it("should clean up", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$dom("n1", '<div class="jFactory-test">').appendTo("body");
        component.$domFetch("n2", "https://api.test.local/asset.html").then(r => r.appendTo("body")); // no await
        expect($(".jFactory-test").length).equal(1);
        component.$domRemove("n1");
        component.$domRemove("n2");
        await wait(10); // load
        expect($(".jFactory-test").length).equal(0);
        component.$uninstall();
    });

    it("should not unregister on chain complete", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$domFetch("n1", "https://api.test.local/asset.html");
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.dom.get("n1")).instanceof(JFactoryFetch);
        await n11;
        expect(component.$.dom.has("n1")).equal(true);
        component.$uninstall();
    });

    it("should unregister task on chain complete", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$domFetch("n1", "https://api.test.local/asset.html");
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.tasks.get('$domFetch("n1")')).instanceof(JFactoryPromise);
        await n11;
        expect(component.$.tasks.has('$domFetch("n1")')).equal(false);
        component.$uninstall();
    });

    it("should chainAbort", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$domFetch("n1", "https://api.test.local/asset.html")
            .then(r => wait(1).then(() => r))
            .$chainAbort();
        expect(component.$.tasks.has('$domFetch("n1")')).equal(false);
        expect(component.$.dom.has("n1")).equal(true); // SPEC: the entry is not auto removed
        try {
            await n1
        } catch (e) {
            expect(e).instanceof(JFACTORY_ERR_PROMISE_EXPIRED);
        }
        component.$uninstall();
    });

    // ---

    it("should set dom id", async function() {
        let component = jFactory("component");
        await component.$install(true);

        // don't set id if not prefixed with "#"
        component.$dom("dom1", "<div id='myId' class='jFactory-test'>").appendTo("body");
        expect($("#myId").length).equal(1);
        expect(component.$.dom.has("dom1")).equal(true);
        component.$domRemove("dom1");
        expect($("#myId").length).equal(0);
        $(".jFactory-test").remove();

        // one element
        component.$dom("#dom1", "<div class='jFactory-test'>").appendTo("body");
        expect($("#dom1").length).equal(1);
        expect(component.$.dom.has("dom1")).equal(true);
        component.$domRemove("dom1");
        expect($("#dom1").length).equal(0);
        $(".jFactory-test").remove();

        // one element but already an id
        component.$dom("#dom1", "<div id='myId' class='jFactory-test'>").appendTo("body");
        expect($("#dom1").length).equal(1);
        expect(component.$.dom.has("dom1")).equal(true);
        component.$domRemove("dom1");
        expect($("#dom1").length).equal(0);
        $(".jFactory-test").remove();

        // more elements (set the id for the first only)
        component.$dom("#dom1",
            '<div id="myId" class="jFactory-test">' +
            '<div id="d2" class="jFactory-test">' +
            '<div id="d3" class="jFactory-test">'
        ).appendTo("body");
        expect($("#dom1, #d2, #d3").length).equal(3);
        expect($("#myId").length).equal(0);
        expect(component.$.dom.has("dom1")).equal(true);
        component.$domRemove("dom1");
        expect($("#dom1").length).equal(0);
        $(".jFactory-test").remove();

        component.$uninstall()
    });
});
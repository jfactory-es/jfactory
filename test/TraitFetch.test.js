// ---------------------------------------------------------------------------------------------------------------------
// TraitFetch Test
// ---------------------------------------------------------------------------------------------------------------------

import {
    describe, it, expect,
    wait,
    jFactory, JFactoryFetch, JFactoryPromise, JFACTORY_ERR_PROMISE_EXPIRED
} from "../scripts/test/test-import.mjs";

describe("Trait Fetch", function() {

    it("should fetch", async function() {
        let component = jFactory("component");
        await component.$install(true);
        expect(await component.$fetch("n1", "https://api.test.local/asset.txt")).instanceof(Response);
        expect(await component.$fetchText("n2", "https://api.test.local/asset.txt")).equal("Hello world!");
        expect(await component.$fetchJSON("n3", "https://api.test.local/asset.json")).include({ data1: 123, data2: 456 });
        component.$uninstall();
    });

    it("should return JFactoryFetch", async function() {
        let component = jFactory("component");
        await component.$install(true);
        expect(component.$fetch("n1", "https://api.test.local/asset.txt")).instanceof(JFactoryFetch);
        expect(component.$fetchText("n2", "https://api.test.local/asset.txt")).instanceof(JFactoryFetch);
        expect(component.$fetchJSON("n3", "https://api.test.local/asset.json")).instanceof(JFactoryFetch);
        component.$uninstall();
    });

    it("should task", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$fetch("n1", "https://api.test.local/asset.txt");
        component.$fetchText("n2", "https://api.test.local/asset.txt");
        component.$fetchJSON("n3", "https://api.test.local/asset.json");
        expect(component.$.tasks.has('$fetch("n1")')).equal(true);
        expect(component.$.tasks.has('$fetch("n2")')).equal(true);
        expect(component.$.tasks.has('$fetch("n3")')).equal(true);
        component.$uninstall();
    });

    it("should phase", async function() {
        let component = jFactory("component", {
            onInstall() {
                this.$fetch("n1", "https://api.test.local/asset.txt")
                    .then(r => wait(10).then(() => r.text()))
                    .then(r => this.n1 = r)
            },
            onEnable() {
                this.pass = this.n1 === "Hello world!";
                this.n2 = this.$fetch("n2", "https://api.test.local/asset.txt")
                    .then(r => wait(10).then(() => r.text()))
                    .then(r => this.n2 = r)
            }
        });
        await component.$install(true);
        expect(component.pass).equal(true);
        expect(component.n2).equal("Hello world!");
        component.$uninstall();
    });

    it("should register", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$fetch("n1", "https://api.test.local/asset.txt");
        component.$fetchText("n2", "https://api.test.local/asset.txt");
        component.$fetchJSON("n3", "https://api.test.local/asset.json");
        expect(component.$.requests.has("n1")).equal(true);
        expect(component.$.requests.has("n2")).equal(true);
        expect(component.$.requests.has("n3")).equal(true);
        component.$uninstall();
    });

    it("should unregister", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$fetch("n1", "https://api.test.local/asset.txt");
        component.$fetchText("n2", "https://api.test.local/asset.txt");
        component.$fetchJSON("n3", "https://api.test.local/asset.json");
        component.$fetchRemove("n1");
        component.$fetchRemove("n2");
        component.$fetchRemove("n3");
        expect(component.$.requests.has("n1")).equal(false);
        expect(component.$.requests.has("n2")).equal(false);
        expect(component.$.requests.has("n3")).equal(false);
        component.$uninstall();
    });

    it("should unregister all", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$fetch("n1", "https://api.test.local/asset.txt");
        component.$fetchText("n2", "https://api.test.local/asset.txt");
        component.$fetchJSON("n3", "https://api.test.local/asset.json");
        component.$fetchRemoveAll(jFactory.PHASE.DISABLE);
        expect(component.$.requests.has("n1")).equal(false);
        expect(component.$.requests.has("n2")).equal(false);
        expect(component.$.requests.has("n3")).equal(false);
        component.$uninstall();
    });

    it("should unregister on chain complete", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$fetchText("n1", "https://api.test.local/asset.txt");
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.requests.get("n1")).instanceof(JFactoryFetch);
        await n11;
        expect(component.$.requests.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should unregister task on chain complete", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$fetchText("n1", "https://api.test.local/asset.txt");
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.tasks.get('$fetch("n1")')).instanceof(JFactoryPromise);
        await n11;
        expect(component.$.tasks.has('$fetch("n1")')).equal(false);
        component.$uninstall();
    });

    it("should chainAbort", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$fetchText("n1", "https://api.test.local/asset.txt")
            .then(r => wait(1).then(() => r))
            .$chainAbort();
        expect(component.$.tasks.has('$fetch("n1")')).equal(false);
        expect(component.$.requests.has("n1")).equal(false);
        try {
            await n1
        } catch (e) {
            expect(e).instanceof(JFACTORY_ERR_PROMISE_EXPIRED);
        }
        component.$uninstall();
    });
});
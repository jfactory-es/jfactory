// ---------------------------------------------------------------------------------------------------------------------
// TraitTimeout Test
// ---------------------------------------------------------------------------------------------------------------------

import {
    jFactoryModule,
    describe, it, expect,
    wait
} from "../../scripts/test/test-import.mjs";

const {
    jFactory,
    JFactoryPromise,
    JFACTORY_ERR_PROMISE_EXPIRED
} = jFactoryModule;

describe("Trait Timeout", function() {

    it("should timeout", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component.$timeout("n1", 30, () => {}).then(() => n1 = true);
        let n2 = component.$timeout("n2", 30).then(() => n2 = true);
        await wait(0);
        expect(n1).not.equal(true);
        expect(n2).not.equal(true);
        expect(await wait(30));
        expect(n1).equal(true);
        expect(n2).equal(true);
        component.$uninstall();
    });

    it("should return JFactoryPromise", async function() {
        let component = jFactory("component");
        await component.$install(true);
        expect(component.$timeout("n1", 30, () => {})).instanceof(JFactoryPromise);
        expect(component.$timeout("n2", 30)).instanceof(JFactoryPromise);
        component.$uninstall();
    });

    it("should task", async function() {
        let component = jFactory("component");
        await component.$install(true);
        expect(component.$timeout("n1", 30, () => {})).instanceof(JFactoryPromise);
        expect(component.$timeout("n2", 30)).instanceof(JFactoryPromise);
        expect(component.$.tasks.has('$timeout("n1")')).equal(true);
        expect(component.$.tasks.has('$timeout("n2")')).equal(true);
        component.$uninstall();
    });

    it("should phase", async function() {
        let component = jFactory("component", {
            onInstall() {
                this.$timeout("1", 30, () => 1)
                    .then(r => wait(10).then(() => r))
                    .then(r => this.n1 = r)
            },
            onEnable() {
                this.pass = this.n1 === 1;
                this.n2 = this.$timeout("n2", 30)
                    .then(() => wait(10).then(() => 2))
                    .then(r => this.n2 = r)
            }
        });
        await component.$install(true);
        expect(component.pass).equal(true);
        expect(component.n2).equal(2);
        component.$uninstall();
    });

    it("should register", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$timeout("n1", 30, () => {});
        component.$timeout("n2", 30);
        expect(component.$.timeouts.has("n1")).equal(true);
        expect(component.$.timeouts.has("n2")).equal(true);
        component.$uninstall();
    });

    it("should unregister", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$timeout("n1", 30, () => {});
        component.$timeout("n2", 30);
        component.$timeoutRemove("n1");
        component.$timeoutRemove("n2");
        expect(component.$.timeouts.has("n1")).equal(false);
        expect(component.$.timeouts.has("n2")).equal(false);
        component.$uninstall();
    });

    it("should unregister all", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$timeout("n1", 30, () => {});
        component.$timeout("n2", 30);
        component.$timeoutRemoveAll(jFactory.PHASE.DISABLE);
        expect(component.$.timeouts.has("n1")).equal(false);
        expect(component.$.timeouts.has("n2")).equal(false);
        component.$uninstall();
    });

    it("should clean up", async function() {
        let pass = true;
        let component = jFactory("component");
        await component.$install(true);
        component.$timeout("n1", 1, () => pass = false);
        component.$timeoutRemove("n1");
        await wait(20);
        expect(pass).equal(true);
        component.$uninstall();
    });

    it("should unregister on chain complete", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$timeout("n1", 30);
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.timeouts.get("n1")).instanceof(JFactoryPromise);
        await n11;
        expect(component.$.timeouts.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should unregister task on chain complete", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$timeout("n1", 30);
        let n11 = n1
            .then(r => wait(1).then(() => r));
        await n1;
        expect(component.$.tasks.get('$timeout("n1")')).instanceof(JFactoryPromise);
        await n11;
        expect(component.$.tasks.has('$timeout("n1")')).equal(false);
        component.$uninstall();
    });

    it("should chainAbort", async function() {
        let component = jFactory("component");
        await component.$install(true);
        let n1 = component
            .$timeout("n1", 30)
            .then(r => wait(1).then(() => r))
            .$chainAbort();

        expect(component.$.tasks.has('$timeout("n1")')).equal(false);
        expect(component.$.timeouts.has("n1")).equal(false);
        try {
            await n1
        } catch (e) {
            expect(e).instanceof(JFACTORY_ERR_PROMISE_EXPIRED);
        }
        component.$uninstall();
    });
});
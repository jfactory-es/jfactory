const { wait, expect } = require("../scripts/dev/test-utils");

// ---------------------------------------------------------------------------------------------------------------------
// TraitTask Test
// ---------------------------------------------------------------------------------------------------------------------

const { jFactory, jFactoryError, JFactoryPromise } = require("../dist");

describe("Trait Tasks", function() {

    it("should task", async function() {
        let result = false;
        let component = jFactory("component");
        component.$install(true);
        await component.$task("n1", wait(10).then(() => result = true));
        expect(result).equal(true);
        component.$uninstall();
    });

    it("should return JFactoryPromise", async function() {
        let component = jFactory("component");
        component.$install(true);
        expect(component.$task("n1", wait(10))).instanceof(JFactoryPromise);
        component.$uninstall();
    });

    it("should phase", async function() {
        let component = jFactory("component", {
            onInstall() {
                this.$task("n1", wait(10).then(() => 1))
                    .then(r => wait(10).then(() => r))
                    .then(r => this.n1 = r)
            },
            onEnable() {
                this.pass = this.n1 === 1;
                this.$task("n2", wait(10).then(() => 2))
                    .then(r => wait(10).then(() => r))
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
        component.$install(true);
        component.$task("n1", wait(10));
        expect(component.$.tasks.has("n1")).equal(true);
        component.$uninstall();
    });

    it("should unregister", async function() {
        let component = jFactory("component");
        component.$install(true);
        component.$task("n1", wait(10));
        component.$taskRemove("n1");
        expect(component.$.tasks.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should unregister all", async function() {
        let component = jFactory("component");
        component.$install(true);
        component.$task("n1", wait(10));
        component.$taskRemoveAll(jFactory.PHASE.DISABLE);
        expect(component.$.tasks.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should phaseRemove", async function() {
        let p;
        let component = jFactory("component", {
            onInstall() {this.$task("p1", wait(0))},
            onEnable() {this.$task("p2", wait(0))},
            onDisable() {this.$task("p3", wait(0))},
            onUninstall() {this.$task("p4", wait(0))}
        });

        p = component.$install();
        expect(component.$.tasks.get("p1").$phaseRemove).equal(jFactory.PHASE.UNINSTALL);
        await p;

        p = component.$enable();
        expect(component.$.tasks.get("p2").$phaseRemove).equal(jFactory.PHASE.DISABLE);
        await p;

        p = component.$disable();
        expect(component.$.tasks.get("p3").$phaseRemove).equal(jFactory.PHASE.ENABLE);
        await p;

        p = component.$uninstall();
        expect(component.$.tasks.get("p4").$phaseRemove).equal(jFactory.PHASE.INSTALL);
        await p;
    });

    it("should clean up", async function() {
        let result = true;
        let component = jFactory("component");
        component.$install(true);
        component.$task("n1", wait(10)).then(() => result = false);
        component.$taskRemove("n1");
        await wait(10);
        expect(result).equal(true);
        component.$uninstall();
    });

    it("should unregister on chain complete", async function() {
        let component = jFactory("component");
        component.$install(true);
        let n1 = component
            .$task("n1", wait(10));
        let n11 = n1
            .then(() => {});
        await n1;
        expect(component.$.tasks.get("n1")).instanceof(JFactoryPromise);
        await n11;
        expect(component.$.tasks.has("n1")).equal(true);
        component.$uninstall();
    });

    it("should chainAbort", async function() {
        let component = jFactory("component");
        component.$install(true);
        let n1 = component
            .$task("n1", wait(10))
            .then(r => wait(1).then(() => r))
            .$chainAbort();
        expect(component.$.tasks.has("n1")).equal(false);
        try {
            await n1
        } catch (e) {
            expect(e).instanceof(jFactoryError.PROMISE_EXPIRED);
        }
        component.$uninstall();
    });
});
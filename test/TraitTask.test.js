const { wait, expect } = require("../scripts/dev/test-utils");

// ---------------------------------------------------------------------------------------------------------------------
// TraitTask Test
// ---------------------------------------------------------------------------------------------------------------------

const { jFactory, jFactoryError, JFactoryPromise } = require("../dist");

describe("Trait Tasks", function() {

    it("should task", async function() {
        let result = false;
        let component = jFactory("component");
        await component.$install(true);
        await component.$task("n1", wait(10).then(() => result = true));
        expect(result).equal(true);
        component.$uninstall();
    });

    it("should return JFactoryPromise", async function() {
        let component = jFactory("component");
        await component.$install(true);
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
        await component.$install(true);
        component.$task("n1", wait(10));
        expect(component.$.tasks.has("n1")).equal(true);
        component.$uninstall();
    });

    it("should unregister", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$task("n1", wait(10));
        component.$taskRemove("n1");
        expect(component.$.tasks.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should unregister all", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$task("n1", wait(10));
        component.$taskRemoveAll(jFactory.PHASE.DISABLE);
        expect(component.$.tasks.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should phaseRemove", async function() {
        let f = () => {};
        let component = jFactory("component", {
            onInstall() {this.p1 = this.$task("p1", wait(0))},
            onEnable() {this.p2 = this.$task("p2", wait(0))},
            onDisable() {this.p3 = this.$task("p3", wait(0))},
            onUninstall() {this.p4 = this.$task("p4", wait(0))}
        });

        await component.$install(true);
        await component.$uninstall();
        expect(component.p1.$phaseRemove).equal(jFactory.PHASE.UNINSTALL);
        expect(component.p2.$phaseRemove).equal(jFactory.PHASE.DISABLE);
        expect(component.p3.$phaseRemove).equal(jFactory.PHASE.ENABLE);
        expect(component.p4.$phaseRemove).equal(jFactory.PHASE.INSTALL);
    });

    it("should clean up", async function() {
        let result = true;
        let component = jFactory("component");
        await component.$install(true);
        component.$task("n1", wait(1)).then(() => {
            debugger
            result = false
        });
        component.$taskRemove("n1");
        await wait(10);
        expect(result).equal(true);
        component.$uninstall();
    });

    it("should unregister on chain complete", async function() {
        let component = jFactory("component");
        await component.$install(true);
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
        await component.$install(true);
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
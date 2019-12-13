const { wait, expect } = require("../scripts/dev/test-utils");

// ---------------------------------------------------------------------------------------------------------------------
// TraitInterval Test
// ---------------------------------------------------------------------------------------------------------------------

const { jFactory } = require("../dist");

describe("Trait Interval", function() {

    it("should interval", async function() {
        let c = 0;
        let component = jFactory("component");
        component.$install(true);
        await wait(1); // helps to fix latency
        component.$interval("n1", 10, () => c++);
        await wait(100);
        expect(c).to.be.least(2);
        component.$uninstall();
    });

    it("should register", async function() {
        let component = jFactory("component");
        component.$install(true);
        component.$interval("n1", 10, () => {});
        expect(component.$.timeints.has("n1")).equal(true);
        component.$uninstall();
    });

    it("should unregister", async function() {
        let component = jFactory("component");
        component.$install(true);
        component.$interval("n1", 10, () => {});
        component.$intervalRemove("n1");
        expect(component.$.timeints.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should unregister all", async function() {
        let component = jFactory("component");
        component.$install(true);
        component.$interval("n1", 10, () => {});
        component.$intervalRemoveAll(jFactory.PHASE.DISABLE);
        expect(component.$.timeints.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should clean up", async function() {
        let pass = true;
        let component = jFactory("component");
        component.$install(true);
        component.$interval("n1", 1, () => pass = false);
        component.$intervalRemove("n1");
        await wait(20);
        expect(pass).equal(true);
        component.$uninstall();
    });
});
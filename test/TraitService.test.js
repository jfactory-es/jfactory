const { wait, expect } = require("../scripts/dev/test-utils");

// ---------------------------------------------------------------------------------------------------------------------
// TraitService
// ---------------------------------------------------------------------------------------------------------------------

const { jFactory, JFactoryComponent, JFactoryPromiseSync } = require("../dist");

class SyncComponent extends JFactoryComponent {
    constructor(...args) {
        super(...args);
        expect(this.$.service.phase).equal(jFactory.PHASE.NONE);
        this.test_state = "";
    }

    onInstall() {
        expect(this.$.states.installed).equal(true);
        expect(this.$.states.enabled).equal(false);
        expect(this.$.service.phase).equal(jFactory.PHASE.INSTALL);
        this.test_state += ">installed";
    }

    onUninstall() {
        expect(this.$.states.installed).equal(false);
        expect(this.$.states.enabled).equal(false);
        expect(this.$.service.phase).equal(jFactory.PHASE.UNINSTALL);
        this.test_state += ">uninstalled";
    }

    onEnable() {
        expect(this.$.states.installed).equal(true);
        expect(this.$.states.enabled).equal(true);
        expect(this.$.service.phase).equal(jFactory.PHASE.ENABLE);
        this.test_state += ">enabled";
    }

    onDisable() {
        expect(this.$.states.installed).equal(true);
        expect(this.$.states.enabled).equal(false);
        expect(this.$.service.phase).equal(jFactory.PHASE.DISABLE);
        this.test_state += ">disabled";
    }

    customHandler() {
        expect(this.$.service.phase).equal(jFactory.PHASE.NONE);
        this.test_state += ">custom";
    }
}

class AsyncComponent extends JFactoryComponent {
    constructor(...args) {
        super(...args);
        expect(this.$.service.phase).equal(jFactory.PHASE.NONE);
        this.test_state = "";
    }

    async onInstall() {
        expect(this.$.states.installed).equal(true);
        expect(this.$.states.enabled).equal(false);
        expect(this.$.service.phase).equal(jFactory.PHASE.INSTALL);
        this.test_state += ">installing...";
        await wait(0);
        this.$task("p1", wait(0)).then(() => 111);
        this.test_state += ">installed";
        // this.$on('test', asyncTest);
        expect(this.$.service.phase).equal(jFactory.PHASE.INSTALL);
    }

    async onUninstall() {
        expect(this.$.states.installed).equal(false);
        expect(this.$.states.enabled).equal(false);
        expect(this.$.service.phase).equal(jFactory.PHASE.UNINSTALL);
        this.test_state += ">uninstalling...";
        await wait(0);
        this.$task("p2", wait(0)).then(() => 111);
        this.test_state += ">uninstalled";
        expect(this.$.service.phase).equal(jFactory.PHASE.UNINSTALL);
    }

    async onEnable() {
        expect(this.$.states.installed).equal(true);
        expect(this.$.states.enabled).equal(true);
        expect(this.$.service.phase).equal(jFactory.PHASE.ENABLE);
        this.test_state += ">enabling...";
        await wait(0);
        this.$task("p3", wait(0)).then(() => 111);
        this.test_state += ">enabled";
        // this.$on('test', asyncTest);
        expect(this.$.service.phase).equal(jFactory.PHASE.ENABLE);
    }

    async onDisable() {
        expect(this.$.states.installed).equal(true);
        expect(this.$.states.enabled).equal(false);
        expect(this.$.service.phase).equal(jFactory.PHASE.DISABLE);
        this.test_state += ">disabling...";
        await wait(0);
        this.$task("p4", wait(0)).then(() => 111);
        this.test_state += ">disabled";
        expect(this.$.service.phase).equal(jFactory.PHASE.DISABLE);
    }

    async customHandler() {
        expect(this.$.service.phase).equal(jFactory.PHASE.NONE);
        this.test_state += ">custom...";
        await wait(0);
        this.$task("p5", wait(0)).then(() => 111);
        this.test_state += ">custom";
        expect(this.$.service.phase).equal(jFactory.PHASE.NONE);
    }
}

let pending;

let syncComponent = new SyncComponent("syncComponent");
let syncTest  = function() {++syncTest.c};
let syncReset = function() {
    syncComponent.$uninstall();
    syncComponent = new SyncComponent("syncComponent");
    syncTest.c = 0;
};

let asyncComponent = new AsyncComponent("asyncComponent");
let asyncTest  = async function() {await wait(10);asyncTest.c++};
let asyncReset = async function() {
    await asyncComponent.$uninstall();
    asyncComponent = new AsyncComponent("asyncComponent");
    asyncTest.c = 0;
};

describe("Trait Service", function() {

    it("should be uninstalled and disabled by default", async function() {
        syncReset();
        expect(syncComponent.$.states.installed).equal(false);
        expect(syncComponent.$.states.enabled).equal(false);

        await asyncReset();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
    });

    it("should not enable() if uninstalled", async function() {
        syncReset();
        syncComponent.$enable();
        expect(syncComponent.$.states.installed).equal(false);
        expect(syncComponent.$.states.enabled).equal(false);

        await asyncReset();
        await asyncComponent.$enable();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
    });

    it("should be installed but disabled after install(false)", async function() {
        syncReset();
        syncComponent.$install();
        expect(syncComponent.$.states.installed).equal(true);
        expect(syncComponent.$.states.enabled).equal(false);

        syncReset();
        syncComponent.$install(undefined);
        expect(syncComponent.$.states.installed).equal(true);
        expect(syncComponent.$.states.enabled).equal(false);

        syncReset();
        syncComponent.$install(0);
        expect(syncComponent.$.states.installed).equal(true);
        expect(syncComponent.$.states.enabled).equal(false);

        await asyncReset();
        await asyncComponent.$install(false);
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(false);
    });

    it("should be installed and enabled after install(true)", async function() {
        syncReset();
        syncComponent.$install(1);
        expect(syncComponent.$.states.installed).equal(true);
        expect(syncComponent.$.states.enabled).equal(true);

        await asyncReset();
        await asyncComponent.$install(true);
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(true);
    });

    it("should be uninstalled and disabled after uninstall()", async function() {
        syncReset();
        syncComponent.$install(true);
        syncComponent.$uninstall();
        expect(syncComponent.$.states.installed).equal(false);
        expect(syncComponent.$.states.enabled).equal(false);

        await asyncReset();
        await asyncComponent.$install(true);
        await asyncComponent.$uninstall();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
    });

    it("should return a promise", async function() {

        // sync
        // ----
        syncReset();

        // install
        pending = syncComponent.$install();
        expect(syncComponent.$.service.phase).equal(jFactory.PHASE.NONE);
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(pending.$isSettled).equal(true);

        // already installed
        pending = syncComponent.$install();
        expect(syncComponent.$.service.phase).equal(jFactory.PHASE.NONE);
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(pending.$isSettled).equal(true);

        // enable
        pending = syncComponent.$enable();
        expect(syncComponent.$.service.phase).equal(jFactory.PHASE.NONE);
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(pending.$isSettled).equal(true);

        // already enabled
        pending = syncComponent.$enable();
        expect(syncComponent.$.service.phase).equal(jFactory.PHASE.NONE);
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(pending.$isSettled).equal(true);

        // already installed and enabled
        pending = syncComponent.$install(true);
        expect(syncComponent.$.service.phase).equal(jFactory.PHASE.NONE);
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(pending.$isSettled).equal(true);

        syncComponent.$uninstall();

        // async
        // -----
        await asyncReset();

        // install
        pending = asyncComponent.$install();
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.INSTALL);
        expect(pending.$isSettled).equal(false);
        await pending;
        expect(pending.$isSettled).equal(true);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.NONE);

        // already installed
        pending = asyncComponent.$install();
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.NONE);
        expect(pending.$isSettled).equal(true); // already installed
        await pending;
        expect(pending.$isSettled).equal(true);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.NONE);

        // enable
        pending = asyncComponent.$enable();
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.ENABLE);
        expect(pending.$isSettled).equal(false);
        await pending;
        expect(pending.$isSettled).equal(true);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.NONE);

        // already enabled
        pending = asyncComponent.$enable();
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.NONE);
        expect(pending.$isSettled).equal(true); // already enabled
        await pending;
        expect(pending.$isSettled).equal(true);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.NONE);

        // already installed and enabled
        pending = asyncComponent.$install(true);
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.NONE);
        expect(pending.$isSettled).equal(true); // already installed and enabled
        await pending;
        expect(pending.$isSettled).equal(true);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.NONE);

        await asyncReset();

        // install + enable
        pending = asyncComponent.$install(true);
        expect(pending).instanceof(JFactoryPromiseSync);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.INSTALL);
        expect(pending.$isSettled).equal(false);
        await pending;
        expect(pending.$isSettled).equal(true);
        expect(asyncComponent.$.service.phase).equal(jFactory.PHASE.NONE);

        await asyncComponent.$uninstall()
    });

    it("should safely change phase synchronously", async function() {
        syncReset();

        syncComponent.$install(true);
        expect(syncComponent.$.states.installed).equal(true);
        expect(syncComponent.$.states.enabled).equal(true);
        expect(syncComponent.test_state).equal(">installed>enabled");
        syncComponent.$uninstall();
        expect(syncComponent.$.states.installed).equal(false);
        expect(syncComponent.$.states.enabled).equal(false);
        expect(syncComponent.test_state).equal(">installed>enabled>disabled>uninstalled");

        await wait(0);
        expect(syncComponent.$.states.installed).equal(false);
        expect(syncComponent.$.states.enabled).equal(false);
        expect(syncComponent.test_state).equal(">installed>enabled>disabled>uninstalled");
    });

    it("should respect the service handlers call order", async function() {

        // install(true)
        // -------------

        await asyncReset();

        pending = asyncComponent.$install(1);
        expect(asyncComponent.test_state).equal(
            ">installing...");
        await pending;
        expect(asyncComponent.test_state).equal(
            ">installing...>installed>enabling...>enabled");

        // install(false)
        // -------------

        await asyncReset();

        pending = asyncComponent.$install();
        expect(asyncComponent.test_state).equal(
            ">installing...");
        await pending;
        expect(asyncComponent.test_state).equal(
            ">installing...>installed");

        // enable
        pending = asyncComponent.$enable();
        expect(asyncComponent.test_state).equal(
            ">installing...>installed>enabling...");
        await pending;
        expect(asyncComponent.test_state).equal(
            ">installing...>installed>enabling...>enabled");

        // disable
        pending = asyncComponent.$disable();
        expect(asyncComponent.test_state).equal(
            ">installing...>installed>enabling...>enabled>disabling...");
        await pending;
        expect(asyncComponent.test_state).equal(
            ">installing...>installed>enabling...>enabled>disabling...>disabled");

        // uninstall
        pending = asyncComponent.$uninstall();
        expect(asyncComponent.test_state).equal(
            ">installing...>installed>enabling...>enabled>disabling...>disabled>uninstalling...");
        await pending;
        expect(asyncComponent.test_state).equal(
            ">installing...>installed>enabling...>enabled>disabling...>disabled>uninstalling...>uninstalled");
    });

    it("should handle async state change", async function() {

        // expected
        await asyncReset();
        await asyncComponent.$install();
        expect(asyncComponent.$.service.phase).equal("PHASE_NONE");
        expect(asyncComponent.$.tasks.size).equal(0);
        await asyncComponent.$enable();
        expect(asyncComponent.$.service.phase).equal("PHASE_NONE");
        expect(asyncComponent.$.tasks.size).equal(0);
        await asyncComponent.$disable();
        expect(asyncComponent.$.service.phase).equal("PHASE_NONE");
        expect(asyncComponent.$.tasks.size).equal(0);
        await asyncComponent.$uninstall();
        expect(asyncComponent.$.service.phase).equal("PHASE_NONE");
        expect(asyncComponent.$.tasks.size).equal(0);

        // install(true)
        // -------------

        // pending install(true) followed by install()
        await asyncReset();
        asyncComponent.$install(1);
        await asyncComponent.$install();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(true);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled");

        // pending install(true) followed by enable()
        await asyncReset();
        asyncComponent.$install(1);
        await asyncComponent.$enable();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(true);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled");

        // pending install(true) followed by disable()
        await asyncReset();
        asyncComponent.$install(1);
        await asyncComponent.$disable();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled");

        // pending install(true) followed by uninstall()
        await asyncReset();
        asyncComponent.$install(1);
        await asyncComponent.$uninstall();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled" +
            ">uninstalling...>uninstalled");

        // install(false)
        // -------------

        // pending install() followed by install()
        await asyncReset();
        asyncComponent.$install();
        await asyncComponent.$install();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed");

        // pending install() followed by enable()
        await asyncReset();
        asyncComponent.$install();
        await asyncComponent.$enable();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(true);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled");

        // pending install() followed by disable()
        await asyncReset();
        asyncComponent.$install();
        await asyncComponent.$disable();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed");

        // pending install() followed by uninstall()
        await asyncReset();
        asyncComponent.$install();
        await asyncComponent.$uninstall();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>uninstalling...>uninstalled");

        // enable
        // -------

        // pending enable followed by install()
        await asyncReset();
        await asyncComponent.$install();
        asyncComponent.$enable();
        await asyncComponent.$install();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(true);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled");

        // pending enable followed by enable()
        await asyncReset();
        await asyncComponent.$install();
        asyncComponent.$enable();
        await asyncComponent.$enable();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(true);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled");

        // pending enable followed by disable()
        await asyncReset();
        await asyncComponent.$install();
        asyncComponent.$enable();
        await asyncComponent.$disable();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled");

        // pending enable followed by uninstall()
        await asyncReset();
        await asyncComponent.$install();
        asyncComponent.$enable();
        await asyncComponent.$uninstall();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled" +
            ">uninstalling...>uninstalled");

        // disable
        // -------

        // pending disable followed by install()
        await asyncReset();
        await asyncComponent.$install(1);
        asyncComponent.$disable();
        await asyncComponent.$install();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled");

        // pending disable followed by enable()
        await asyncReset();
        await asyncComponent.$install(1);
        asyncComponent.$disable();
        await asyncComponent.$enable();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(true);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled" +
            ">enabling...>enabled");

        // pending disable followed by disable()
        await asyncReset();
        await asyncComponent.$install(1);
        asyncComponent.$disable();
        await asyncComponent.$disable();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled");

        // pending disable followed by uninstall()
        await asyncReset();
        await asyncComponent.$install(1);
        asyncComponent.$disable();
        await asyncComponent.$uninstall();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled" +
            ">uninstalling...>uninstalled");

        // uninstall (enabled)
        // -------------------

        // pending uninstall followed by install
        await asyncReset();
        await asyncComponent.$install(1);
        asyncComponent.$uninstall();
        await asyncComponent.$install();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled" +
            ">uninstalling...>uninstalled>installing...>installed");

        // pending uninstall followed by enable
        await asyncReset();
        await asyncComponent.$install(1);
        asyncComponent.$uninstall();
        await asyncComponent.$enable();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled" +
            ">uninstalling...>uninstalled");

        // pending uninstall followed by disable
        await asyncReset();
        await asyncComponent.$install(1);
        asyncComponent.$uninstall();
        await asyncComponent.$disable();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled" +
            ">uninstalling...>uninstalled");

        // pending uninstall followed by uninstall
        await asyncReset();
        await asyncComponent.$install(1);
        asyncComponent.$uninstall();
        await asyncComponent.$uninstall();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed>enabling...>enabled>disabling...>disabled" +
            ">uninstalling...>uninstalled");

        // uninstall (not enable)
        // ----------------------

        // pending uninstall followed by install
        await asyncReset();
        await asyncComponent.$install();
        asyncComponent.$uninstall();
        await asyncComponent.$install();
        expect(asyncComponent.$.states.installed).equal(true);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed" +
            ">uninstalling...>uninstalled>installing...>installed");

        // pending uninstall followed by enable
        await asyncReset();
        await asyncComponent.$install();
        asyncComponent.$uninstall();
        await asyncComponent.$enable();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed" +
            ">uninstalling...>uninstalled");

        // pending uninstall followed by disable
        await asyncReset();
        await asyncComponent.$install();
        asyncComponent.$uninstall();
        await asyncComponent.$disable();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed" +
            ">uninstalling...>uninstalled");

        // pending uninstall followed by uninstall
        await asyncReset();
        await asyncComponent.$install();
        asyncComponent.$uninstall();
        await asyncComponent.$uninstall();
        expect(asyncComponent.$.states.installed).equal(false);
        expect(asyncComponent.$.states.enabled).equal(false);
        expect(asyncComponent.test_state).equal(">installing...>installed" +
            ">uninstalling...>uninstalled");
    });

    it("should reject api calls if not enabled", async function() {
        let component = jFactory("component");
        component.$.logger.disable();
        expect(() => component.$task()).throw("component disabled");
        component.$install();
        expect(() => component.$task()).throw("component disabled");
        await component.$enable();
        component.$task("task", wait(0));
        await component.$uninstall();
        expect(() => component.$task()).throw("component disabled");
    });

    it("should interrupt the pending phase on opposite phase change for disable() and uninstall() only", async function() {
        let fail;
        let phase;
        let component;

        // ---
        // uninstall should stop install
        fail = false;
        component = jFactory("component", {
            async onInstall() {
                await this.$timeout("timeout", 100, () => fail = true);
                await this.$timeout("timeout", 5000, () => fail = true)
            }
        });

        phase = component.$install();
        await component.$uninstall();
        await phase;
        expect(fail).equal(false);

        // ---
        // disable should stop enable
        fail = false;
        component = jFactory("component", {
            async onEnable() {
                await this.$timeout("timeout", 100, () => fail = true);
                await this.$timeout("timeout", 5000, () => fail = true)
            }
        });
        await component.$install();

        phase = component.$enable();
        await component.$disable();
        await phase;
        expect(fail).equal(false);

        // ---
        // enable should NOT stop disable
        fail = true;
        component = jFactory("component", {
            async onDisable() {
                await this.$timeout("timeout", 100, () => fail = false);
            }
        });
        await component.$install(true);

        phase = component.$disable();
        await component.$enable();
        await phase;
        expect(fail).equal(false);

        // ---
        // install should NOT stop uninstall
        fail = true;
        component = jFactory("component", {
            async onUninstall() {
                await this.$timeout("timeout", 100, () => fail = false);
            }
        });
        await component.$install();

        phase = component.$uninstall();
        await component.$install();
        await phase;
        expect(fail).equal(false);
    });
});
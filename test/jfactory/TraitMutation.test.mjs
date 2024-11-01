// ---------------------------------------------------------------------------------------------------------------------
// TraitMutation Test
// ---------------------------------------------------------------------------------------------------------------------

import {
    jFactoryModule,
    jQuery as $,
    describe, it, expect, afterEach, beforeEach,
    wait
} from "../../scripts/test/test-import.mjs";

const {
    jFactory
} = jFactoryModule;

describe("Trait Mutation", function() {

    beforeEach(function() {
        $('<div id="dom1" class="jFactory-test">').appendTo("body");
    });

    afterEach(function() {
        $(".jFactory-test").remove();
    });

    it("should mutation", async function() {
        let dom1 = $("#dom1");
        let result = null, p = $("<p>")[0];
        let component = jFactory("component");
        await component.$install(true);
        component.$mutation("n1", dom1[0], { childList: true }, mutations => result = mutations);
        dom1.append(p).children().remove();
        await wait(0); // MutationObserver callbacks are called asynchronously
        expect(result[0].addedNodes[0]).equal(p);
        expect(result[1].removedNodes[0]).equal(p);
        component.$uninstall();
    });

    it("should register", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$mutation("n1", document, { childList: true }, () => {});
        expect(component.$.mutations.has("n1")).equal(true);
        component.$uninstall();
    });

    it("should unregister", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$mutation("n1", document, { childList: true }, () => {});
        component.$mutationRemove("n1");
        expect(component.$.mutations.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should unregister all", async function() {
        let component = jFactory("component");
        await component.$install(true);
        component.$mutation("n1", document, { childList: true }, () => {});
        component.$mutationRemoveAll(jFactory.PHASE.DISABLE);
        expect(component.$.mutations.has("n1")).equal(false);
        component.$uninstall();
    });

    it("should clean up", async function() {
        let dom1 = $("#dom1");
        let result = null, p = $("<p>")[0];
        let component = jFactory("component");
        await component.$install(true);
        component.$mutation("n1", dom1[0], { childList: true }, mutations => result = mutations);
        component.$mutationRemove("n1");
        dom1.append(p).children().remove();
        await wait(0); // MutationObserver callbacks are called asynchronously
        expect(result).equal(null);
        component.$uninstall();
    });
});
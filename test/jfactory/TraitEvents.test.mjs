// ---------------------------------------------------------------------------------------------------------------------
// TraitEvents
// ---------------------------------------------------------------------------------------------------------------------

import {
    jFactoryModule,
    jQuery as $,
    describe, it, expect
} from "../../scripts/test/test-import.mjs";

const {
    jFactory
} = jFactoryModule;

describe("TraitEvents", function() {

    it("$on() customEvents", async function() {
        let event1;
        let event2;

        let component = jFactory("component");
        await component.$install(true);

        component.$on("customEvent1", (event, data) => {
            event1 += data.a + 1;
        });
        component.$on("customEvent2", (event, data) => {
            event2 += data.a + 1;
        });

        event1 = event2 = 0;
        await component.$trigger("customEvent1", { a: 10 });
        expect(event1).equal(11);
        expect(event2).equal(0);

        event1 = event2 = 0;
        await component.$trigger("customEvent2", { a: 10 });
        expect(event1).equal(0);
        expect(event2).equal(11);

        component.$uninstall();
    });

    it("$trigger() customEvents with namespaces", async function() {
        let event1;

        let component = jFactory("component");
        await component.$install(true);
        component.$on("customEvent1.ns0.ns1", (event, data) => {
            event1 += data.a;
        });

        // no match
        event1 = 0;
        await component.$trigger("customEvent1", { a: 10 });
        expect(event1).equal(10);

        // match
        event1 = 0;
        await component.$trigger("customEvent1.ns0", { a: 10 });
        expect(event1).equal(10);

        // match
        event1 = 0;
        await component.$trigger("customEvent1.ns1", { a: 10 });
        expect(event1).equal(10);

        // match
        event1 = 0;
        await component.$trigger("customEvent1.ns1.ns0", { a: 10 });
        expect(event1).equal(10);

        // no match
        event1 = 0;
        await component.$trigger("customEvent1.none", { a: 10 });
        expect(event1).equal(0);

        // no match
        event1 = 0;
        await component.$trigger("customEvent1.ns0.ns1.none", { a: 10 });
        expect(event1).equal(0);

        component.$uninstall();
    });

    it("$trigger() same handler from several customEvents", async function() {
        let event1;

        let component = jFactory("component");
        await component.$install(true);
        component.$on("customEvent1 customEvent2", () => {
            event1++;
        });

        // same handler called 2 times
        event1 = 0;
        await component.$trigger("customEvent1 customEvent2", { a: 1 });
        expect(event1).equal(2);

        component.$uninstall();
    });

    it("$trigger() same handler from several customEvents with namespaces", async function() {
        let event1;

        let component = jFactory("component");
        await component.$install(true);
        component.$on("customEvent1.ns1 customEvent2.ns2", () => {
            event1++;
        });

        // call only handler where namespace match
        event1 = 0;
        await component.$trigger("customEvent2.ns2 customEvent1", { a: 1 });
        expect(event1).equal(2);

        event1 = 0;
        await component.$trigger("customEvent1.ns2 customEvent2.ns2.ns1", { a: 1 });
        expect(event1).equal(0);

        event1 = 0;
        await component.$trigger("customEvent1.ns1 customEvent2", { a: 1 });
        expect(event1).equal(2);

        event1 = 0;
        await component.$trigger("customEvent1.ns1 customEvent2.ns2", { a: 1 });
        expect(event1).equal(2);

        event1 = 0;
        await component.$trigger("customEvent1.ns2 customEvent2.ns2", { a: 1 });
        expect(event1).equal(1);

        component.$uninstall();
    });

    it("$trigger() same handler from same event name with namespaces", async function() {
        let event1;

        let component = jFactory("component");
        await component.$install(true);
        component.$on("customEvent.ns1 customEvent.ns2", () => {
            event1++;
        });

        // call only handler where namespace match
        event1 = 0;
        await component.$trigger("customEvent.ns2 customEvent", { a: 1 });
        expect(event1).equal(3);

        event1 = 0;
        await component.$trigger("customEvent.ns2 customEvent.ns1", { a: 1 });
        expect(event1).equal(2);

        event1 = 0;
        await component.$trigger("customEvent.ns1.ns2", { a: 1 });
        expect(event1).equal(0);

        component.$uninstall();
    });

    it("$off() event with namespaces", async function() {
        let event1;
        let event2;

        let component = jFactory("component");
        await component.$install(true);

        event1 = event2 = 0;
        component.$off();
        component.$on("click.ns1.ns2", "body", () => {
            event1++;
        });
        component.$on("click.ns2.ns2", "body", () => {
            event2++;
        });
        component.$trigger("click", "body");
        expect(event1).equal(1);
        expect(event2).equal(1);

        // off(.ns1) remove the two handler
        event1 = event2 = 0;
        component.$off();
        component.$on("click.ns1.ns2", "body", () => {
            event1++;
        });
        component.$on("click.ns2.ns1", "body", () => {
            event2++;
        });
        component.$off(".ns1", "body");
        component.$trigger("click", "body");
        expect(event1).equal(0);
        expect(event2).equal(0);

        // off(.ns1.wrong) remove nothing
        event1 = event2 = 0;
        component.$off();
        component.$on("click.ns1.ns2", "body", () => {
            event1++;
        });
        component.$on("click.ns2.ns1", "body", () => {
            event2++;
        });
        component.$off(".ns1.wrong", "body");
        component.$trigger("click", "body");
        expect(event1).equal(1);
        expect(event2).equal(1);

        component.$uninstall();
    });

    it("$off(event [, target] [, selector] [,handler])", async function() {
        let event1;

        $('<div class="div"></div><div class="div"></div>').appendTo("body");

        let h1 = () => event1++;
        let component = jFactory("component");
        await component.$install(true);

        event1 = 0;
        component.$off();
        component.$on("click", "body", ".div", () => {
            event1++;
        });
        component.$trigger("click", ".div");
        expect(event1).equal(2);

        // off(event, target, selector)
        event1 = 0;
        component.$off();
        component.$on("click", "body", ".div", h1);
        component.$off("click", "body", ".div");
        component.$trigger("click", ".div");
        expect(event1).equal(0);

        // off(event, target, selector, handler)
        event1 = 0;
        component.$off();
        component.$on("click", "body", ".div", h1);
        component.$off("click", "body", ".div", h1);
        component.$trigger("click", ".div");
        expect(event1).equal(0);

        // off(event, target, handler)
        event1 = 0;
        component.$off();
        component.$on("click", "body", ".div", h1);
        component.$off("click", "body", h1);
        component.$trigger("click", ".div");
        expect(event1).equal(0);

        // off(event, handler)
        event1 = 0;
        component.$off();
        component.$on("click", "body", ".div", h1);
        component.$off("click", h1);
        component.$trigger("click", ".div");
        expect(event1).equal(0);

        // off(event, target)
        event1 = 0;
        component.$off();
        component.$on("click", "body", ".div", h1);
        component.$off("click", "body");
        component.$trigger("click", ".div");
        expect(event1).equal(0);

        // off(event)
        event1 = 0;
        component.$off();
        component.$on("click", "body", ".div", h1);
        component.$off("click");
        component.$trigger("click", ".div");
        expect(event1).equal(0);

        $(".div").remove();
        component.$uninstall();
    });
});
// ---------------------------------------------------------------------------------------------------------------------
// JFactoryEvents
// ---------------------------------------------------------------------------------------------------------------------

import {
    jFactoryModule,
    describe, it, expect,
    wait
} from "../scripts/test/test-import.mjs";

const {
    JFACTORY_DEV,
    JFactoryCoreObject,
    JFactoryError,
    JFactoryEvents,
    JFactoryEventsManager
} = jFactoryModule;

describe("JFactoryEvents", function() {
    let coreClass = new JFactoryCoreObject("test");
    let jFactoryEventsManager = new JFactoryEventsManager(coreClass);
    let jFactoryEvents = new JFactoryEvents();

    if (JFACTORY_DEV) {

        it("should throw JFactoryError on invalid arguments", function() {
            let handler = function() {};

            expect(() => jFactoryEvents.on({})).to.throw("cannot be undefined");
            expect(() => jFactoryEvents.on({ events: "abc.a.b.c d ef.e" })).to.throw("must be a function");
            expect(() => jFactoryEvents.on({ events: " abc.a.b.c d ef.e", handler })).to.throw("space delimiters");
            expect(() => jFactoryEvents.on({ events: "abc.a.b.c d ef.e ", handler })).to.throw("space delimiters");
            expect(() => jFactoryEvents.on({ events: "abc.a.b.c  d ef.e", handler })).to.throw("space delimiters");
            expect(() => jFactoryEvents.on({ events: "abc.a.b.c d ef.&", handler })).to.throw("alphanumeric");

            expect(() => jFactoryEvents.off({ events: " abc.a.b.c d ef.e", handler })).to.throw("space delimiters");
            expect(() => jFactoryEvents.off({ events: "abc.a.b.c d ef.e ", handler })).to.throw("space delimiters");
            expect(() => jFactoryEvents.off({ events: "abc.a.b.c  d ef.e", handler })).to.throw("space delimiters");
            expect(() => jFactoryEvents.off({ events: "abc.a.b.c d ef.&", handler })).to.throw("alphanumeric");

            expect(() => jFactoryEvents.triggerParallel({})).to.throw("cannot be undefined");
            expect(() => jFactoryEvents.triggerParallel({ events: " abc" })).to.throw("space delimiters");
            expect(() => jFactoryEvents.triggerParallel({ events: "abc " })).to.throw("space delimiters");
            expect(() => jFactoryEvents.triggerParallel({ events: "abc  d" })).to.throw("space delimiters");
            expect(() => jFactoryEvents.triggerParallel({ events: "a&" })).to.throw("alphanumeric");

            expect(() => jFactoryEvents.triggerSeries({})).to.throw("cannot be undefined");
            expect(() => jFactoryEvents.triggerSeries({ events: " abc" })).to.throw("space delimiters");
            expect(() => jFactoryEvents.triggerSeries({ events: "abc " })).to.throw("space delimiters");
            expect(() => jFactoryEvents.triggerSeries({ events: "abc  d" })).to.throw("space delimiters");
            expect(() => jFactoryEvents.triggerSeries({ events: "a&" })).to.throw("alphanumeric");
        });

        it("should throw JFactoryError on invalid affiliate arguments", function() {
            expect(() => jFactoryEventsManager.affiliate()).to.not.throw(JFactoryError);
            expect(() => jFactoryEventsManager.affiliate("f")).to.not.throw(JFactoryError);
            expect(() => jFactoryEventsManager.affiliate("f&", "a")).to.throw("alphanumeric");
            expect(() => jFactoryEventsManager.affiliate("f", "a&")).to.throw("alphanumeric");
            expect(() => jFactoryEventsManager.affiliate("f ", "a")).to.throw("space delimiters");
            expect(() => jFactoryEventsManager.affiliate(" f", "a")).to.throw("space delimiters");
            expect(() => jFactoryEventsManager.affiliate("f  f", "a")).to.throw("space delimiters");
            expect(() => jFactoryEventsManager.affiliate("f", " a")).to.throw("alphanumeric");
            expect(() => jFactoryEventsManager.affiliate("f", "a ")).to.throw("alphanumeric");
            expect(() => jFactoryEventsManager.affiliate("f", "a  b")).to.throw("alphanumeric");
        });
    }

    it("should respect namespaces", function() {
        let c1, c2;
        let handler1 = function() {c1++};
        let handler2 = function() {c2++};

        jFactoryEvents.on({ events: "abc.a.b.c d ef.e", handler: handler1 });
        jFactoryEvents.on({ events: "abc.d d ef.e.f", handler: handler2 });

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "abc" }); // call abc.a.b.c, abc.d
        expect(c1).equal(1);
        expect(c2).equal(1);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "abc.b" }); // call abc.a.b.c
        expect(c1).equal(1);
        expect(c2).equal(0);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "abc.d" }); // call abc.d
        expect(c1).equal(0);
        expect(c2).equal(1);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "abc.c.a" }); // call abc.a.b.c
        expect(c1).equal(1);
        expect(c2).equal(0);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "abc.nothing" }); // no handler match this namespace
        expect(c1).equal(0);
        expect(c2).equal(0);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "abc.a.nothing.b" }); // no handler match this namespace
        expect(c1).equal(0);
        expect(c2).equal(0);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "abc.a.b.c.d" }); // no handler match the full namespace
        expect(c1).equal(0);
        expect(c2).equal(0);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "d" }); // call h1, h2
        expect(c1).equal(1);
        expect(c2).equal(1);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "ef.e" }); // call h1, h2
        expect(c1).equal(1);
        expect(c2).equal(1);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "ef.f" }); // call h2
        expect(c1).equal(0);
        expect(c2).equal(1);

        c1 = c2 = 0;
        jFactoryEvents.triggerSeries({ events: "abc.c d.i ef.f" }); // call abc.a.b.c, ef.f
        expect(c1).equal(1);
        expect(c2).equal(1);

        // cleanup
        c1 = c2 = 0;
        jFactoryEvents.off({ events: "abc.a.b.c d ef.e", handler: handler1 });
        jFactoryEvents.off({ events: "abc.d d ef.e.f", handler: handler2 });
        jFactoryEvents.triggerSeries({ events: "abc" });
        jFactoryEvents.triggerSeries({ events: "d" });
        jFactoryEvents.triggerSeries({ events: "ef" });
        expect(c1).equal(0);
        expect(c2).equal(0);
    });

    it("should respect namespaces (async)", async function() {
        let c1, c2;
        let handler1 = async function() {
            await wait(10);
            c1++
        };
        let handler2 = async function() {
            await wait(1);
            c2++
        };

        jFactoryEvents.on({ events: "abc.a.b.c d ef.e", handler: handler1 });
        jFactoryEvents.on({ events: "abc.d d ef.e.f", handler: handler2 });

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "abc" }); // call abc.a.b.c, abc.d
        expect(c1).equal(1);
        expect(c2).equal(1);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "abc.b" }); // call abc.a.b.c
        expect(c1).equal(1);
        expect(c2).equal(0);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "abc.d" }); // call abc.d
        expect(c1).equal(0);
        expect(c2).equal(1);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "abc.c.a" }); // call abc.a.b.c
        expect(c1).equal(1);
        expect(c2).equal(0);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "abc.nothing" }); // no handler match this namespace
        expect(c1).equal(0);
        expect(c2).equal(0);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "abc.a.nothing.b" }); // no handler match this namespace
        expect(c1).equal(0);
        expect(c2).equal(0);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "abc.a.b.c.d" }); // no handler match the full namespace
        expect(c1).equal(0);
        expect(c2).equal(0);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "d" }); // call h1, h2
        expect(c1).equal(1);
        expect(c2).equal(1);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "ef.e" }); // call h1, h2
        expect(c1).equal(1);
        expect(c2).equal(1);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "ef.f" }); // call h2
        expect(c1).equal(0);
        expect(c2).equal(1);

        c1 = c2 = 0;
        await jFactoryEvents.triggerSeries({ events: "abc.c d.i ef.f" }); // call call abc.a.b.c, ef.f
        expect(c1).equal(1);
        expect(c2).equal(1);

        // cleanup
        c1 = c2 = 0;
        jFactoryEvents.off({ events: "abc.a.b.c d ef.e", handler: handler1 });
        jFactoryEvents.off({ events: "abc.d d ef.e.f", handler: handler2 });
        await jFactoryEvents.triggerSeries({ events: "abc" });
        await jFactoryEvents.triggerSeries({ events: "d" });
        await jFactoryEvents.triggerSeries({ events: "ef" });
        expect(c1).equal(0);
        expect(c2).equal(0);
    });

    it("should affiliate without duplicates", function() {
        expect(jFactoryEventsManager.affiliate("abc.a.b.a.c def.b.c.b", "a.d.a.b")).equal("abc.a.b.c.d def.b.c.a.d")
    });

    it("should trigger multiple events", function() {
        let c1;
        let handler = function() {c1++};

        jFactoryEvents.on({ events: "abc def", handler });

        c1 = 0;
        jFactoryEvents.triggerSeries({ events: "def abc" });
        expect(c1).equal(2);

        c1 = 0;
        jFactoryEvents.triggerSeries({ events: "def" });
        expect(c1).equal(1);

        c1 = 0;
        jFactoryEvents.off({ events: "abc def", handler });
        jFactoryEvents.triggerSeries({ events: "abc def" });
        expect(c1).equal(0);
    });

    it("should always return promise", async function() {
        let c1, c2, result;
        let handler1 = function() {c1++};
        let handler2 = async function() {
            await wait(1);
            c2++
        };

        jFactoryEvents.on({ events: "abc", handler: handler1 });
        jFactoryEvents.on({ events: "def", handler: handler2 });

        // triggerSeries
        c1 = c2 = 0;
        result = jFactoryEvents.triggerSeries({ events: "abc" });
        expect(result).instanceof(Promise);
        expect(c1).equal(1);
        result = jFactoryEvents.triggerSeries({ events: "def" });
        expect(result).instanceof(Promise);
        await result;
        expect(c2).equal(1);

        // triggerParallel
        c1 = c2 = 0;
        result = jFactoryEvents.triggerParallel({ events: "abc" });
        expect(result).instanceof(Promise);
        expect(c1).equal(1);
        result = jFactoryEvents.triggerParallel({ events: "def" });
        expect(result).instanceof(Promise);
        await result;
        expect(c2).equal(1);

        c1 = c2 = 0;
        jFactoryEvents.off({ events: "def", handler1 });
        jFactoryEvents.off({ events: "abc", handler2 });
        await jFactoryEvents.triggerSeries({ events: "abc def" });
        expect(c1).equal(0);
        expect(c2).equal(0);
    });

    it("should call same handler for different event", function() {
        let c;
        let handler = function() {c++};

        jFactoryEvents.on({ events: "abc", handler });
        jFactoryEvents.on({ events: "def", handler });

        c = 0;
        jFactoryEvents.triggerSeries({ events: "abc" });
        expect(c).equal(1);
        jFactoryEvents.triggerSeries({ events: "def" });
        expect(c).equal(2);

        c = 0;
        jFactoryEvents.off({ events: "abc", handler });
        jFactoryEvents.triggerSeries({ events: "abc" });
        expect(c).equal(0);

        jFactoryEvents.triggerSeries({ events: "def" });
        expect(c).equal(1);

        c = 0;
        jFactoryEvents.off({ events: "def", handler });
        jFactoryEvents.triggerSeries({ events: "def" });
        expect(c).equal(0);
    });

    it("should call same handler for different event (async)", async function() {
        let c;
        let handler = async function() {
            await wait(1);
            c++;
        };

        jFactoryEvents.on({ events: "abc", handler });
        jFactoryEvents.on({ events: "def", handler });

        c = 0;
        await jFactoryEvents.triggerSeries({ events: "abc" });
        expect(c).equal(1);
        await jFactoryEvents.triggerSeries({ events: "def" });
        expect(c).equal(2);

        c = 0;
        jFactoryEvents.off({ events: "abc", handler });
        await jFactoryEvents.triggerSeries({ events: "abc" });
        expect(c).equal(0);

        await jFactoryEvents.triggerSeries({ events: "def" });
        expect(c).equal(1);
        c = 0;

        jFactoryEvents.off({ events: "def", handler });
        await jFactoryEvents.triggerSeries({ events: "def" });
        expect(c).equal(0);
    });

    it("should triggerParallel()", async function() {
        let s, result;
        let handler1 = function(e) {s += ">h1:" + e.type};
        let handler2 = async function(e) {
            await wait(1);
            s += ">h2:" + e.type
        };

        let reset = function() {
            s = "";
            jFactoryEvents.off({ events: "abc def" });
        };

        reset();
        jFactoryEvents.on({ events: "abc", handler: handler1 });
        jFactoryEvents.on({ events: "abc", handler: handler2 });
        jFactoryEvents.on({ events: "abc", handler: handler1 });
        jFactoryEvents.on({ events: "abc", handler: handler2 });
        jFactoryEvents.on({ events: "abc", handler: handler1 });
        result = jFactoryEvents.triggerParallel({ events: "abc" });
        expect(s).equal(">h1:abc>h1:abc>h1:abc");
        expect(result).instanceof(Promise);
        await result;
        expect(s).equal(">h1:abc>h1:abc>h1:abc>h2:abc>h2:abc");

        reset();
        jFactoryEvents.on({ events: "abc def", handler: handler1 });
        jFactoryEvents.on({ events: "abc def", handler: handler2 });
        jFactoryEvents.on({ events: "abc def", handler: handler1 });
        result = jFactoryEvents.triggerParallel({ events: "abc def" });
        expect(result).instanceof(Promise);
        expect(s).equal(">h1:abc>h1:abc>h1:def>h1:def");
        await result;
        expect(s).equal(">h1:abc>h1:abc>h1:def>h1:def>h2:abc>h2:def");

        // clean
        reset();
        result = await jFactoryEvents.triggerParallel({ events: "abc def" });
        expect(s).equal("");
    });

    it("should triggerSeries()", async function() {
        let s, result;
        let handler1 = function(e) {s += ">h1:" + e.type};
        let handler2 = async function(e) {
            await wait(1);
            s += ">h2:" + e.type
        };

        let reset = function() {
            s = "";
            jFactoryEvents.off({ events: "abc def" });
        };

        reset();
        jFactoryEvents.on({ events: "abc", handler: handler1 });
        jFactoryEvents.on({ events: "abc", handler: handler2 });
        jFactoryEvents.on({ events: "abc", handler: handler1 });
        jFactoryEvents.on({ events: "abc", handler: handler2 });
        jFactoryEvents.on({ events: "abc", handler: handler1 });
        result = jFactoryEvents.triggerSeries({ events: "abc" });
        expect(s).equal(">h1:abc");
        expect(result).instanceof(Promise);
        await result;
        expect(s).equal(">h1:abc>h2:abc>h1:abc>h2:abc>h1:abc");

        reset();
        jFactoryEvents.on({ events: "abc def", handler: handler1 });
        jFactoryEvents.on({ events: "abc def", handler: handler2 });
        jFactoryEvents.on({ events: "abc def", handler: handler1 });
        result = jFactoryEvents.triggerSeries({ events: "abc def" });
        expect(result).instanceof(Promise);
        expect(s).equal(">h1:abc");
        await result;
        expect(s).equal(">h1:abc>h2:abc>h1:abc>h1:def>h2:def>h1:def");

        // clean
        reset();
        result = await jFactoryEvents.triggerSeries({ events: "abc def" });
        expect(s).equal("");
    });

    describe("off", function() {
        let c1, c2;
        let h1 = async function() {await wait(1);c1++};
        let h2 = async function() {await wait(1);c2++};

        let reset = function(){
            c1 = c2 = 0;
            jFactoryEvents.off({ events: "abc" });
            jFactoryEvents.on({ events: "abc.n1.n2", handler: h1 });
            jFactoryEvents.on({ events: "abc abc.n3", handler: h2 });
        };

        it("should off()", async function() {
            reset();
            jFactoryEvents.off({});
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(0);
        });

        it("should off(name.namespace, handler)", async function() {
            reset();
            jFactoryEvents.off({ events: "abc", handler: h1 });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc", handler: h2 });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(0);

            reset();
            jFactoryEvents.off({ events: "abc.n2", handler: h1 });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n2", handler: h2 });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n4", handler: h2 });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n1.n2 abc.n3", handler: h1 });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n1.n2 abc.n3 abc", handler: h1 });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);
        });

        it("should off(name.namespace)", async function() {
            reset();
            jFactoryEvents.off({ events: "abc" });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(0);

            reset();
            jFactoryEvents.off({ events: "abc.n1.n2" });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n2.n1" });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n2" });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n1" });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n3" });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(1);

            reset();
            jFactoryEvents.off({ events: "abc.n4" }); // no match
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n1.n2.n3" }); // no match
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: "abc.n1.n2 abc.n3" });
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(1);

            reset();
            jFactoryEvents.off({ events: "abc.n1.n2 abc.n3 abc" }); // remove all
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(0);
        });

        it("should off(.namespace, handler)", async function() {
            reset();
            jFactoryEvents.off({ events: ".n2", handler: h1 }); // remove abc.n2
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: ".n2", handler: h2 }); // no match
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: ".n4", handler: h2 }); // no match
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: ".n2.n1 .n3", handler: h1 }); // remove abc.n1.n2
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: ".n1.n2 .n3", handler: h2 }); // remove abc.n3
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(1);
        });

        it("should off(.namespace)", async function() {
            reset();
            jFactoryEvents.off({ events: ".n2" }); // remove abc.n2
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: ".n4" }); // no match
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(1);
            expect(c2).equal(2);

            reset();
            jFactoryEvents.off({ events: ".n2.n1 .n3" }); // remove abc.n1.n2 and abc.n3
            await jFactoryEvents.triggerSeries({ events: "abc" });
            expect(c1).equal(0);
            expect(c2).equal(1);
        });
    });
});
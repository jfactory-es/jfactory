require("./env-devel.js");
const { jQuery, jFactory, JFactoryPromise } = require("jfactory/auto");
const { describe, it, expect } = await import("vitest");

describe("import /cjs-env", function() {
    it("import", function() {
        // TODO test flag cjs build
        // TODO test flag devel
        expect(jQuery).toBeTypeOf("function");
        expect(jFactory).toBeTypeOf("function");
        expect(JFactoryPromise).toBeTypeOf("function");
    });
});
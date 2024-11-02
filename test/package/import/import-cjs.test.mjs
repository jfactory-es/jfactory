const { jQuery, jFactory, JFactoryPromise, JFACTORY_ESM } = require("jfactory");
const { describe, it, expect } = await import("vitest");

describe("import /cjs", function() {
    it("import", function() {
        expect(jQuery).toBeTypeOf("function");
        expect(jFactory).toBeTypeOf("function");
        expect(JFactoryPromise).toBeTypeOf("function");
        expect(JFACTORY_ESM).eq(false);
    });
});
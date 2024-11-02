import { jQuery, jFactory, JFactoryPromise, JFACTORY_ESM } from "jfactory";
import { describe, it, expect } from "vitest";

describe("import /es", function() {
    it("import", function() {
    // TODO test flag es build
        expect(jQuery).toBeTypeOf("function");
        expect(jFactory).toBeTypeOf("function");
        expect(JFactoryPromise).toBeTypeOf("function");
        expect(JFACTORY_ESM).eq(1);
    });
});
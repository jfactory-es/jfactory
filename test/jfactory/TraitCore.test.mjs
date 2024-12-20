// ---------------------------------------------------------------------------------------------------------------------
// TraitCore Test
// ---------------------------------------------------------------------------------------------------------------------

import {
    jFactoryModule,
    describe, it, expect
} from "../../scripts/test/test-import.mjs";

const {
    jFactory
} = jFactoryModule;

describe("Trait Core", function() {
    it("should auto index", async function() {
        let component = jFactory("component");
        expect(component.$.css.id_autoinc).equal(0);
        expect(component.$.css.$id_resolve("?")).equal("1");
        expect(component.$.css.id_autoinc).equal(1);
        expect(component.$.css.$id_resolve("a?b?c")).equal("a2b2c");
        expect(component.$.css.$id_resolve("??")).equal("33");
    })
});
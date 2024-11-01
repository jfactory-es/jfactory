// ---------------------------------------------------------------------------------------------------------------------
// JFactoryTraits
// ---------------------------------------------------------------------------------------------------------------------

import {
    jFactoryModule,
    describe, it, expect
} from "../scripts/test/test-import.mjs";

const { JFactoryTraits } = jFactoryModule;

describe("JFactoryTraits", function() {

    it("should not re-inject same Trait", function() {

        class TraitA {}

        class Class {
            constructor() {
                new JFactoryTraits(this, Class)
                    .use(TraitA);

                Object.defineProperty(TraitA.prototype, "test", {
                    value: function() {}
                });

                new JFactoryTraits(this, Class)
                    .use(TraitA); // ignored
            }
        }

        let test = new Class("test");
        expect(test.test).equal(undefined)
    });

    it("should not override existing method",  function() {

        class TraitA {
            test() {
                return 111
            }
        }

        class TraitB {
            test() {
                return 0
            }
        }

        class Class {
            constructor() {

                new JFactoryTraits(this, Class)
                    .use(TraitA)
                    .use(TraitB);
            }
        }

        expect(new Class().test()).equal(111)
    });
});
// ---------------------------------------------------------------------------------------------------------------------
// JFactoryObject
// ---------------------------------------------------------------------------------------------------------------------

import {
    describe, it, expect,
    JFactoryObject
} from "../scripts/test/test-import.mjs";

describe("JFactoryObject", function() {
    it("should prevent prototype pollution", function() {
        let polluted = () => "polluted";
        let source = {
            __proto__ : { toString : polluted },
            // JFactoryObject.assign is not a merge,
            // so we don't need to check:
            // constructor : { prototype : { toString : polluted } }
        }

        let o = {};
        JFactoryObject.assign(o, source, JFactoryObject.descriptors.CONFIGURABLE_WRITABLE_ENUMERABLE);
        expect(o.toString).not.equal(polluted)
        expect(({}).toString).not.equal(polluted)
    })
})
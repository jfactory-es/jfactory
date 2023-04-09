/**
 * -----------------------------------------------------------------------------------------------------------------
 * JFactoryAbout
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */
import { JFACTORY_DEV } from "../jFactory-env.mjs";
import { helper_camelCase } from "../jFactory-helpers.mjs";
import { JFactoryExpect } from "./JFactoryExpect.mjs";
import { JFactoryObject } from "./JFactoryObject.mjs";

const moduleGenId = () => ++moduleGenId.uid; moduleGenId.uid = 0;

export class JFactoryAbout {
    constructor(owner, about = {}) {
        if (JFACTORY_DEV) {
            JFactoryExpect("JFactoryAbout(owner)", owner).type(Object);
            JFactoryExpect("JFactoryAbout(about)", about)
                .typePlainObject()
                .reservedProperty("uid")
                .reservedProperty("fingerprint");
            if ("name" in about) {
                JFactoryExpect("JFactoryAbout(about.name)", about.name)
                    .typeString()
                    .notEmptyString()
            }
        }

        let name;
        let fingerprint;
        let uid = moduleGenId();

        if (about.name) {
            name = about.name;
            delete about.name;
            fingerprint = "jFactory" + "_" + helper_camelCase(name.toLowerCase()) + "_" + uid
        } else {
            delete about.name;
            name = `[${owner.constructor.name}#${uid}]`;
            fingerprint = "jFactory" + "_" + owner.constructor.name + "_" + uid;
        }

        JFactoryObject.assign(this, /** @lends JFactoryAbout# */ {
            uid,
            name,
            fingerprint
        }, JFactoryObject.descriptors.ENUMERABLE);

        Object.assign(this, about);

        // ---

        if (JFACTORY_DEV) {
            JFactoryExpect("JFactoryAbout.name", this.name)
                .matchReg(/^[\w[\]#]+$/);
            JFactoryExpect("JFactoryAbout.fingerprint", this.fingerprint)
                .matchReg(/^[\w]+$/);
        }
    }
}
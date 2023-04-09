import { JFactoryExpect } from './JFactoryExpect.mjs';
import { JFactoryObject } from './JFactoryObject.mjs';
import helper_camelCase from 'lodash/camelCase.js';

/**
 * -----------------------------------------------------------------------------------------------------------------
 * JFactoryAbout
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

const moduleGenId = () => ++moduleGenId.uid; moduleGenId.uid = 0;

class JFactoryAbout {
    constructor(owner, about = {}) {
        {
            JFactoryExpect("JFactoryAbout(owner)", owner).type(Object);
            JFactoryExpect("JFactoryAbout(about)", about)
                .typePlainObject()
                .reservedProperty("uid")
                .reservedProperty("fingerprint");
            if ("name" in about) {
                JFactoryExpect("JFactoryAbout(about.name)", about.name)
                    .typeString()
                    .notEmptyString();
            }
        }

        let name;
        let fingerprint;
        let uid = moduleGenId();

        if (about.name) {
            name = about.name;
            delete about.name;
            fingerprint = "jFactory" + "_" + helper_camelCase(name.toLowerCase()) + "_" + uid;
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

        {
            JFactoryExpect("JFactoryAbout.name", this.name)
                .matchReg(/^[\w[\]#]+$/);
            JFactoryExpect("JFactoryAbout.fingerprint", this.fingerprint)
                .matchReg(/^[\w]+$/);
        }
    }
}

export { JFactoryAbout };

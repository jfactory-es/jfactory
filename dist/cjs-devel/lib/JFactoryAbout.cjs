'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jFactoryHelpers = require('../jFactory-helpers.cjs');
const JFactoryExpect = require('./JFactoryExpect.cjs');
const JFactoryObject = require('./JFactoryObject.cjs');

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
            JFactoryExpect.JFactoryExpect("JFactoryAbout(owner)", owner).type(Object);
            JFactoryExpect.JFactoryExpect("JFactoryAbout(about)", about)
                .typePlainObject()
                .reservedProperty("uid")
                .reservedProperty("fingerprint");
            if ("name" in about) {
                JFactoryExpect.JFactoryExpect("JFactoryAbout(about.name)", about.name)
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
            fingerprint = "jFactory" + "_" + jFactoryHelpers.helper_camelCase(name.toLowerCase()) + "_" + uid;
        } else {
            delete about.name;
            name = `[${owner.constructor.name}#${uid}]`;
            fingerprint = "jFactory" + "_" + owner.constructor.name + "_" + uid;
        }

        JFactoryObject.JFactoryObject.assign(this, /** @lends JFactoryAbout# */ {
            uid,
            name,
            fingerprint
        }, JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);

        Object.assign(this, about);

        // ---

        {
            JFactoryExpect.JFactoryExpect("JFactoryAbout.name", this.name)
                .matchReg(/^[\w[\]#]+$/);
            JFactoryExpect.JFactoryExpect("JFactoryAbout.fingerprint", this.fingerprint)
                .matchReg(/^[\w]+$/);
        }
    }
}

exports.JFactoryAbout = JFactoryAbout;

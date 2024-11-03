'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jFactoryHelpers = require('../jFactory-helpers.cjs');
require('./JFactoryExpect.cjs');
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
    }
}

exports.JFactoryAbout = JFactoryAbout;

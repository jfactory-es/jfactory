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
    }
}

export { JFactoryAbout };

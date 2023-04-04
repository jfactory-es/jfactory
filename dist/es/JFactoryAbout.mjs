/*!
 * jFactory v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
import './jFactory-env.mjs';
import { helper_camelCase } from './jFactory-helpers.mjs';
import './JFactoryExpect.mjs';
import { JFactoryObject } from './JFactoryObject.mjs';

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryAbout
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

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

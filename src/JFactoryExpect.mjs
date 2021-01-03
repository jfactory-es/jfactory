/* jFactory, Copyright (c) 2019-2021, Stéphane Plazis, https://github.com/jfactory-es/jfactory */

import { JFACTORY_DEV } from "./jFactory-env.mjs";
import { JFACTORY_ERR_INVALID_VALUE } from "./JFactoryError.mjs";
import { helper_isNumber, helper_isPlainObject, helper_isString } from "./jFactory-helpers.mjs";
import { jFactoryBootstrap_onBoot } from "./jFactory-bootstrap.mjs";
import { jFactoryBootstrap_expected } from "./jFactory-bootstrap.mjs";

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryExpect
// ---------------------------------------------------------------------------------------------------------------------
// A small input/output validation tool
// ---------------------------------------------------------------------------------------------------------------------
// Status: Alpha, Draft
// ---------------------------------------------------------------------------------------------------------------------

/**
 * @return {*|JFactoryExpect}
 */
export function JFactoryExpect(label, value) {
    JFACTORY_DEV && jFactoryBootstrap_expected();
    if (new.target) {
        this.label = label;
        this.value = value;
    } else {
        return new JFactoryExpect(label, value)
    }
}

const error = function jFactoryThrow(label, value, message) {
    throw new JFACTORY_ERR_INVALID_VALUE({
        target: label,
        reason: message,
        given: value
    })
};

const staticMethods = {
    /**
     * @method notUndefined
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method notUndefined
     * @memberOf JFactoryExpect
     */
    notUndefined(label, value) {
        if (value === undefined) {
            error(label, value, "cannot be undefined")
        }
        return true
    },

    /**
     * @method notEmptyString
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method notEmptyString
     * @memberOf JFactoryExpect
     */
    notEmptyString(label, value) {
        if (value === "") {
            error(label, value, "cannot be empty string")
        }
        return true
    },

    /**
     * @method notFalsy
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method notFalsy
     * @memberOf JFactoryExpect
     */
    notFalsy(label, value) {
        if (!value) {
            error(label, value, 'cannot be a falsy value (undefined, null, NaN, 0, "")')
        }
        return true
    },

    /**
     * @method validSpaces
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method validSpaces
     * @memberOf JFactoryExpect
     */
    validSpaces(label, value) {
        if (!value.replace || value.replace(/\s+/g, " ").trim() !== value) {
            error(label, value, "invalid space delimiters")
        }
        return true
    },

    /**
     * @method matchReg
     * @memberOf JFactoryExpect#
     * @param {RegExp} reg
     * @return JFactoryExpect
     */
    /**
     * @method matchReg
     * @memberOf JFactoryExpect
     */
    matchReg(label, value, reg) {
        if (!reg.test(value)) {
            error(label, value, 'string "' + value + '" must match ' + reg)
        }
        return true
    },

    /**
     * @method type
     * @memberOf JFactoryExpect#
     * @param {...*} expected
     * @return JFactoryExpect
     */
    /**
     * @method type
     * @memberOf JFactoryExpect
     */
    type(label, value, ...expected) {
        let name, ok = false;
        for (let constructor of expected) {
            if (constructor === null) {
                name = "Null"
            } else if ("name" in constructor) {
                name = constructor.name
            }
            let test = staticMethods["type" + name];
            if (test) {
                try {ok = test(label, value/*, e*/)} catch (e) {}
            } else {
                ok = value instanceof constructor
            }
            if (ok) break
        }
        if (!ok) {
            error(label, value, "must be an instance of [" + expected.map(e => e.name).join(", ") + "]")
        }
        return true
    },

    /**
     * @method typeNull
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method typeNull
     * @memberOf JFactoryExpect
     */
    typeNull(label, value) {
        if (value !== null) {
            error(label, value, "must be null")
        }
        return true
    },

    /**
     * @method typeBoolean
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method typeBoolean
     * @memberOf JFactoryExpect
     */
    typeBoolean(label, value) {
        if (value !== true && value !== false) {
            error(label, value, "must be a boolean")
        }
        return true
    },

    /**
     * @method typeString
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method typeString
     * @memberOf JFactoryExpect
     */
    typeString(label, value) {
        if (!helper_isString(value)) {
            error(label, value, "must be a string")
        }
        return true
    },

    /**
     * @method typeNumber
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method typeNumber
     * @memberOf JFactoryExpect
     */
    typeNumber(label, value) {
        if (!helper_isNumber(value)) {
            error(label, value, "must be a number")
        }
        return true
    },

    /**
     * @method typeFunction
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method typeFunction
     * @memberOf JFactoryExpect
     */
    typeFunction(label, value) {
        if (!(typeof value === "function")) {
            error(label, value, "must be a function")
        }
        return true
    },

    /**
     * @method typePlainObject
     * @memberOf JFactoryExpect#
     * @return JFactoryExpect
     */
    /**
     * @method typePlainObject
     * @memberOf JFactoryExpect
     */
    typePlainObject(label, value) {
        if (!helper_isPlainObject(value)) {
            error(label, value, "must be a plain object")
        }
        return true
    },

    /**
     * @method equal
     * @memberOf JFactoryExpect#
     * @param {*} expected
     * @return JFactoryExpect
     */
    /**
     * @method equal
     * @memberOf JFactoryExpect
     */
    equal(label, value, ...expected) {
        let ok = false;
        for (let e of expected) {
            if ((ok = value === e)) break
        }
        if (!ok) {
            error(label, value, "must be one of [" + expected + "]")
        }
        return true;
    },

    /**
     * @method equalIn
     * @memberOf JFactoryExpect#
     * @param {Array|Object} expected
     * @return JFactoryExpect
     */
    /**
     * @method equalIn
     * @memberOf JFactoryExpect
     */
    equalIn(label, value, expected) {
        if (!Array.isArray(expected)) {
            expected = Object.values(expected)
        }
        if (!expected.includes(value)) {
            error(label, value, "must be one from [" + expected.join(", ") + "]")
        }
        return true
    },

    /**
     * @method properties
     * @memberOf JFactoryExpect#
     * @param {Array} expected
     * @return JFactoryExpect
     */
    /**
     * @method properties
     * @memberOf JFactoryExpect
     */
    properties(label, value, expected) {
        for (let name of Object.getOwnPropertyNames(value)) {
            JFactoryExpect(label + ', property name "' + name + '"', name).equalIn(expected)
        }
        return true
    },

    /**
     * @method writable
     * @memberOf JFactoryExpect#
     * @param {String} key
     * @return JFactoryExpect
     */
    /**
     * @method writable
     * @memberOf JFactoryExpect
     */
    writable(label, value, key) {
        if (!Object.getOwnPropertyDescriptor(value, key).writable) {
            error(label, value, "must be writable")
        }
        return true
    },

    /**
     * @method notWritable
     * @memberOf JFactoryExpect#
     * @param {String} key
     * @return JFactoryExpect
     */
    /**
     * @method notWritable
     * @memberOf JFactoryExpect
     */
    notWritable(label, value, key) {
        if (Object.getOwnPropertyDescriptor(value, key).writable) {
            error(label, value, "must not be writable")
        }
        return true
    },

    /**
     * @method enumerable
     * @memberOf JFactoryExpect#
     * @param {String} key
     * @return JFactoryExpect
     */
    /**
     * @method enumerable
     * @memberOf JFactoryExpect
     */
    enumerable(label, value, key) {
        if (!Object.prototype.propertyIsEnumerable.call(value, key)) {
            error(label, value, "must be enumerable")
        }
        return true
    },

    /**
     * @method notEnumerable
     * @memberOf JFactoryExpect#
     * @param {String} key
     * @return JFactoryExpect
     */
    /**
     * @method notEnumerable
     * @memberOf JFactoryExpect
     */
    notEnumerable(label, value, key) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
            error(label, value, "must not be enumerable")
        }
        return true
    },

    /**
     * @method configurable
     * @memberOf JFactoryExpect#
     * @param {String} key
     * @return JFactoryExpect
     */
    /**
     * @method configurable
     * @memberOf JFactoryExpect
     */
    configurable(label, value, key) {
        if (!Object.getOwnPropertyDescriptor(value, key).configurable) {
            error(label, value, "must be configurable")
        }
        return true
    },

    /**
     * @method notConfigurable
     * @memberOf JFactoryExpect#
     * @param {String} key
     * @return JFactoryExpect
     */
    /**
     * @method notConfigurable
     * @memberOf JFactoryExpect
     */
    notConfigurable(label, value, key) {
        if (Object.getOwnPropertyDescriptor(value, key).configurable) {
            error(label, value, "must not be configurable")
        }
        return true
    },

    /**
     * @method reservedProperty
     * @memberOf JFactoryExpect#
     * @param {String} key
     * @return JFactoryExpect
     */
    /**
     * @method reservedProperty
     * @memberOf JFactoryExpect
     */
    reservedProperty(label, value, key) {
        if (key in value) {
            error(label, value, "is a reserved property")
        }
        return true
    }
};

jFactoryBootstrap_onBoot(function() {
    Object.assign(JFactoryExpect, staticMethods);
    // Generate members from static methods
    for (const name of Object.getOwnPropertyNames(staticMethods)) {
        JFactoryExpect.prototype[name] =
            function callStatic(...args) {
                JFactoryExpect[name](this.label, this.value, ...args);
                return this
            }
    }
});
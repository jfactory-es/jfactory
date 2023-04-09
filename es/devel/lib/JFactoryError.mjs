import { helper_isNative } from '../jFactory-helpers.mjs';
import { jFactoryCfg } from '../jFactory-config.mjs';
import { jFactoryTrace } from './JFactoryTrace.mjs';
import helper_get from 'lodash/get.js';
import helper_lowerFirst from 'lodash/lowerFirst.js';
import helper_template from 'lodash/template.js';

/**
 * -----------------------------------------------------------------------------------------------------------------
 * JFactoryError
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

class JFactoryError extends Error {
    constructor(message = "unspecified error", data = null) {
        data = Object.assign(Object.create(null), data);
        message = JFactoryError.toPrintable(message, data);
        super(message);
        this.$data = Object.assign(Object.create(null), data);
    }

    toString() {
        return this.message
    }

    * [Symbol.iterator]() {
        yield this.message;
        yield this.$data;
    }

    static getId(object) {
        return object[CONFIG.keys.find(key => {
            let val = helper_get(object, key);
            return val || val === 0
        })]
    }

    static toPrintableData(data) {
        const templateData = {};
        let nv;
        for (let [key, val] of Object.entries(data)) {
            switch (typeof val) {
                case "function":
                    val = val.name + "()";
                    break;
                case "object":
                    if (val === null) {
                        val = "null";
                        break
                    }
                    if (val instanceof Error) {
                        val = val.toString();
                        break
                    }
                    if ((nv = JFactoryError.getId(val)) !== undefined) {
                        val = '"' + nv + '"';
                    } else {
                        if (!helper_isNative(val.toString)) {
                            val = val.toString();
                        } else {
                            try {
                                nv = JSON.stringify(val);
                                val = nv.length > CONFIG.jsonMax
                                    ? nv.substring(0, CONFIG.jsonMax) + "[...]" : nv;
                            } catch (e) {
                                val = "[object " + val.constructor.name + "]";
                            }
                        }
                    }
                    break;
                case "string":
                    val = '"' + val + '"';
                    break;
                default:
                    val = String(val);
            }
            templateData[key] = val;
        }
        return templateData
    }

    static toPrintable(template, data) {
        const templateMessage = [];
        for (let part of template.split(";")) {
            let placeholder;
            let re = CONFIG.regPlaceholder;
            re.lastIndex = 0;
            if ((placeholder = re.exec(part))) {
                do {
                    if (placeholder[1] && placeholder[1] in data) {
                        templateMessage.push(part.trim());
                        break
                    }
                } while ((placeholder = re.exec(part)) !== null)
            } else {
                templateMessage.push(part.trim());
            }
        }
        return helper_lowerFirst(helper_template(templateMessage.join("; "))(JFactoryError.toPrintableData(data)));
    }

    static factory(type, template) {
        let ret = {
            [type]: class extends JFactoryError {
                constructor(data, traceSource) {
                    super(template, data);
                    jFactoryTrace.attachTrace(this.$data, traceSource);
                }
            }
        }[type];

        // Chrome automatically resolves sourcemap when logging errors
        // but only if the error name starts with "Error"
        ret.prototype.name = "Error JFACTORY_ERR_" + type;
        return ret
    }
}

// -----------------------------------------------------------------------------------------------------------------
// JFACTORY_ERR_*
// -----------------------------------------------------------------------------------------------------------------

const E = JFactoryError.factory;

/* eslint-disable max-len */
const JFACTORY_ERR_INVALID_VALUE = /*#__PURE__*/E("INVALID_VALUE", "invalid value for ${target}; Reason: ${reason}; Given: ${given}");
const JFACTORY_ERR_INVALID_CALL = /*#__PURE__*/E("INVALID_CALL", "invalid call ${target}; Reason: ${reason}; Owner: ${owner}");
const JFACTORY_ERR_PROMISE_EXPIRED = /*#__PURE__*/E("PROMISE_EXPIRED", "expired promise ${target}; Reason: ${reason}");
const JFACTORY_ERR_REQUEST_ERROR = /*#__PURE__*/E("REQUEST_ERROR", "error requesting ${target}; Reason: ${reason}; Owner: ${owner}");
const JFACTORY_ERR_KEY_DUPLICATED = /*#__PURE__*/E("KEY_DUPLICATED", "duplicated key for ${target}; Given: ${given}");
const JFACTORY_ERR_KEY_MISSING = /*#__PURE__*/E("KEY_MISSING", "missing key for ${target}; Given: ${given}");

// -----------------------------------------------------------------------------------------------------------------
// Config JFactoryError
// -----------------------------------------------------------------------------------------------------------------

const CONFIG = /*#__PURE__*/jFactoryCfg("JFactoryError", {
    regPlaceholder: /\${([^}]+)}/g,
    jsonMax: 40,
    keys: ["$.about.name", "$dev_name", "$name", "name", "id"]
});

export { JFACTORY_ERR_INVALID_CALL, JFACTORY_ERR_INVALID_VALUE, JFACTORY_ERR_KEY_DUPLICATED, JFACTORY_ERR_KEY_MISSING, JFACTORY_ERR_PROMISE_EXPIRED, JFACTORY_ERR_REQUEST_ERROR, JFactoryError };

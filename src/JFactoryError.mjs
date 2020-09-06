/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { JFACTORY_DEV } from "./jFactory-env";
import { jFactoryConfig } from "./jFactory-config";
import { helper_get, helper_isNative, helper_lowerFirst, helper_template } from "./jFactory-helpers";
import { jFactoryTrace } from "./JFactoryTrace";

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryError
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

export class JFactoryError extends Error {
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
        return object[(jFactoryConfig.JFactoryError.keys || JFactoryError.DEFAULT_KEYS).find(key => {
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
                        val = '"' + nv + '"'
                    } else {
                        if (!helper_isNative(val.toString)) {
                            val = val.toString()
                        } else {
                            try {
                                nv = JSON.stringify(val);
                                val = nv.length > JFactoryError.JSON_MAX
                                    ? nv.substring(0, JFactoryError.JSON_MAX) + "[...]" : nv;
                            } catch (e) {
                                val = "[object " + val.constructor.name + "]"
                            }
                        }
                    }
                    break;
                case "string":
                    val = '"' + val + '"';
                    break;
                default:
                    val = String(val)
            }
            templateData[key] = val
        }
        return templateData
    }

    static toPrintable(template, data) {
        const templateMessage = [];
        for (let part of template.split(";")) {
            let placeholder;
            let RE_PLACEHOLDER = JFactoryError.RE_PLACEHOLDER;
            RE_PLACEHOLDER.lastIndex = 0;
            if ((placeholder = RE_PLACEHOLDER.exec(part))) {
                do {
                    if (placeholder[1] && placeholder[1] in data) {
                        templateMessage.push(part.trim());
                        break
                    }
                } while ((placeholder = RE_PLACEHOLDER.exec(part)) !== null)
            } else {
                templateMessage.push(part.trim());
            }
        }
        return helper_lowerFirst(helper_template(templateMessage.join("; "))(JFactoryError.toPrintableData(data)));
    }
}

JFactoryError.JSON_MAX = 40;
JFactoryError.DEFAULT_KEYS = ["name", "id"];
JFactoryError.RE_PLACEHOLDER = /\${([^}]+)}/g;

// ---------------------------------------------------------------------------------------------------------------------
// jFactoryError
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

export let jFactoryError = new Proxy(JFactoryError, {
    set: function(target, property, value) {
        let { template } = value;

        if (JFACTORY_DEV && target[property]) {
            throw new Error("already declared");
        }

        target[property] = class extends JFactoryError {
            constructor(data, traceSource) {
                super(template, data);
                jFactoryTrace.tracer.attachTrace(this.$data, traceSource);
            }
        };
        // Caution: Chrome automatically resolves sourcemap when logging errors
        // but only if the error name starts with "Error"
        target[property].prototype.name = "Error jFactoryError." + property;

        return true
    }
});

jFactoryError.INVALID_VALUE = { template: "invalid value for ${target}; Reason: ${reason}; Given: ${given}" };
jFactoryError.INVALID_CALL = { template: "invalid call ${target}; Reason: ${reason}; Owner: ${owner}" };
jFactoryError.PROMISE_EXPIRED = { template: "expired promise ${target}; Reason: ${reason}" };
jFactoryError.REQUEST_ERROR = { template: "error requesting ${target}; Reason: ${reason}; Owner: ${owner}" };
jFactoryError.KEY_DUPLICATED = { template: "duplicated key for ${target}; Given: ${given}" };
jFactoryError.KEY_MISSING = { template: "missing key for ${target}; Given: ${given}" };
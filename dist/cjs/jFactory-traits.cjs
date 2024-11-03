'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const JFactoryError = require('./lib/JFactoryError.cjs');
const JFactoryTraits = require('./lib/JFactoryTraits.cjs');
const JFactoryFunction = require('./lib/JFactoryFunction.cjs');

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Traits
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

function jFactoryTraits(callerInstance, callerConstructor) {
    return new JFactoryTraits.JFactoryTraits(callerInstance, callerConstructor, {

        parser(propertyName, propertyDescriptor/*, source, target, isStatic */) {
            let parsed = JFactoryTraits.JFactoryTraits.defaultParser(...arguments);

            if (parsed) {
                ({ propertyName, propertyDescriptor } = parsed);

                let value = propertyDescriptor.value;
                if (typeof value === "function") {
                    switch (value.name) {
                        case "$install":
                        case "$uninstall":
                        case "$enable":
                        case "$disable":
                        case "$state":
                            break;
                        default:
                            propertyDescriptor.value = JFactoryFunction.jFactoryFunctionWrappable(value)
                                .beforeAll(function() {
                                    if (!this.$.states.enabled && this.$.service.phase === "PHASE_NONE") {
                                        let e = new JFactoryError.JFACTORY_ERR_INVALID_CALL({
                                            owner: this,
                                            target: value,
                                            reason: "component disabled"
                                        });
                                        this.$logErr(...e);
                                        throw e
                                    }
                                });
                    }
                }

                return { propertyName, propertyDescriptor }
            }
        }
    })
}

exports.jFactoryTraits = jFactoryTraits;

import { JFACTORY_ERR_INVALID_CALL } from './lib/JFactoryError.mjs';
import { JFactoryTraits } from './lib/JFactoryTraits.mjs';
import { jFactoryFunctionWrappable } from './lib/JFactoryFunction.mjs';

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Traits
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

function jFactoryTraits(callerInstance, callerConstructor) {
    return new JFactoryTraits(callerInstance, callerConstructor, {

        parser(propertyName, propertyDescriptor/*, source, target, isStatic */) {
            let parsed = JFactoryTraits.defaultParser(...arguments);

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
                            propertyDescriptor.value = jFactoryFunctionWrappable(value)
                                .beforeAll(function() {
                                    if (!this.$.states.enabled && this.$.service.phase === "PHASE_NONE") {
                                        let e = new JFACTORY_ERR_INVALID_CALL({
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

export { jFactoryTraits };

/*!
 * jFactory v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
import { JFACTORY_ERR_INVALID_CALL } from './JFactoryError.mjs';
import { JFactoryTraits } from './JFactoryTraits.mjs';
import { jFactoryFunctionWrappable } from './JFactoryFunction.mjs';

// ---------------------------------------------------------------------------------------------------------------------
// jFactoryTraits
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

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

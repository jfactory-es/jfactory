/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { jFactoryError } from "./JFactoryError";
import { JFactoryTraits } from "./JFactoryTraits";
import { jFactoryFunctionWrappable } from "./JFactoryFunction";

// ---------------------------------------------------------------------------------------------------------------------
// jFactoryTraits
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

export function jFactoryTraits(callerInstance, callerConstructor) {
    return new JFactoryTraits(callerInstance, callerConstructor, {

        parser(propertyName, propertyDescriptor/*, source, target, isStatic */) {
            let parsed = JFactoryTraits.defaultParser(...arguments);

            if (parsed) {
                ({ propertyName, propertyDescriptor } = parsed);

                let fn = propertyDescriptor.value;
                if (typeof fn === "function") {
                    switch (fn.name) {
                        case "$install":
                        case "$uninstall":
                        case "$enable":
                        case "$disable":
                        case "$state":
                            break;
                        default:
                            propertyDescriptor.value = jFactoryFunctionWrappable(fn)
                                .beforeAll(function() {
                                    if (!this.$.states.enabled && this.$.service.phase === "PHASE_NONE") {
                                        let e = new jFactoryError.INVALID_CALL({
                                            owner: this,
                                            target: fn,
                                            reason: "component disabled"
                                        });
                                        this.$logErr(...e);
                                        throw e
                                    }
                                })
                    }
                }

                return { propertyName, propertyDescriptor }
            }
        }
    })
}
/*!
 * jFactory v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
import { jFactoryBootstrap_onBoot } from './jFactory-bootstrap.mjs';

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryObject
// ---------------------------------------------------------------------------------------------------------------------
// Status: Alpha, HasSideEffects
// ---------------------------------------------------------------------------------------------------------------------

class JFactoryObject {

    static createDescriptors(descriptorPrototype = JFactoryObject.DESCRIPTORS_PROTOTYPE) {
        let create = JFactoryObject.create(descriptorPrototype, true, true);
        let o = Object.create(null);

        o.NONE = create();

        o.WRITABLE     = create({ writable: true });
        o.ENUMERABLE   = create({ enumerable: true });
        o.CONFIGURABLE = create({ configurable: true });

        o.CONFIGURABLE_WRITABLE   =
        o.WRITABLE_CONFIGURABLE   = create({ writable: true, configurable: true });

        o.CONFIGURABLE_ENUMERABLE =
        o.ENUMERABLE_CONFIGURABLE = create({ enumerable: true, configurable: true });

        o.ENUMERABLE_WRITABLE     =
        o.WRITABLE_ENUMERABLE     = create({ writable: true, enumerable: true });

        o.WRITABLE_ENUMERABLE_CONFIGURABLE =
        o.WRITABLE_CONFIGURABLE_ENUMERABLE =
        o.ENUMERABLE_CONFIGURABLE_WRITABLE =
        o.ENUMERABLE_WRITABLE_CONFIGURABLE =
        o.CONFIGURABLE_WRITABLE_ENUMERABLE =
        o.CONFIGURABLE_ENUMERABLE_WRITABLE = create({ writable: true, enumerable: true, configurable: true });

        // Shortcuts
        o.READONLY = create({ writable: false, enumerable: false, configurable: false });

        return o
    }

    /**
     * @example
     * assign(obj, 'myProperty', 123, {writable:false})
     * assign(obj, {a:1, b:2}', {writable:false})
     *
     * deprecated
     * assign(obj, 'myProperty', {value:"ok", writable:false}) => not strict
     * assign(obj, 'myProperty', 123) => use native instead
     * assign(obj, {a:1, b:2}) => use native instead
     */
    static assign(target, property, value, descriptor) {
        let descriptors = {};

        switch (typeof property) {

            case "string":
            case "symbol":

                // ------------------------------------------------
                // assign(obj, 'myProperty', 123, {writable:false})
                // ------------------------------------------------

                if (!descriptor) {
                    throw new Error("missing descriptor argument; use Object.assign instead")
                }

                descriptor = Object.create(descriptor); // avoid descriptor corruption
                descriptor.value = value;

                Object.defineProperty(target, property, descriptor);

                break;

            case "object":

                // ------------------------------------------------
                // assign(obj, {a:1, b:2}', {writable:false})
                // ------------------------------------------------

                [value, descriptor] = [property, value];

                if (!descriptor) {
                    throw new Error("missing descriptor argument; use Object.assign instead")
                }

                for (let name of Object.getOwnPropertyNames(value)) {
                    descriptors[name] = Object.create(descriptor); // avoid descriptor corruption
                    descriptors[name].value = value[name];
                }
                for (let name of Object.getOwnPropertySymbols(value)) {
                    descriptors[name] = Object.create(descriptor); // avoid descriptor corruption
                    descriptors[name].value = value[name];
                }

                Object.defineProperties(target, descriptors);

                break;

            default:
                throw new Error("invalid property argument")
        }

        return target
    }

    static create(prototype, flat = false, disinherit = false) {
        return function create(properties) {
            if (flat) {
                return Object.assign(disinherit ? Object.create(null) : {}, prototype, properties)
            } else {
                return Object.assign(Object.create(
                    disinherit ? Object.assign(Object.create(null), prototype) : prototype
                ), properties)
            }
        }
    }

    static disinherit(object) {
        return Object.assign(Object.create(null), object);
    }
}

JFactoryObject.DESCRIPTORS_PROTOTYPE = { writable: false, enumerable: false, configurable: false };

// ---------------------------------------------------------------------------------------------------------------------
// jFactoryObject
// ---------------------------------------------------------------------------------------------------------------------

jFactoryBootstrap_onBoot(function() {
    JFactoryObject.descriptors = JFactoryObject.createDescriptors();
});

export { JFactoryObject };

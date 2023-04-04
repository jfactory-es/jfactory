/*!
 * jFactory-devel v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
import { JFACTORY_LOG } from './jFactory-env.mjs';
import { JFactoryExpect } from './JFactoryExpect.mjs';

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryTraits
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

class JFactoryTraits {
    /**
     * @param {JFactoryCoreObject|Object} callerInstance
     * @param {Class|Function} callerConstructor
     * @param options
     */
    constructor(callerInstance, callerConstructor, options = {}) {
        /**
         * @type {JFactoryCoreObject}
         */
        this.callerInstance = callerInstance;

        /**
         * @type {Class|Function}
         */
        this.callerConstructor = callerConstructor;

        /**
         * @type {Object}
         */
        this.options = options;
    }

    use(trait, ...traitArgs) {
        {
            JFactoryExpect("JFactoryTraits(trait)", trait).typeFunction();
        }

        // callerConstructor is not always the callerInstance.constructor:
        // The Trait can be injected in an inherited constructor from super() at call time
        let { callerInstance, callerConstructor } = this;

        // Detect improper duplication (can be a trait already called by a super class)
        let cache = JFactoryTraits.CACHE.get(callerInstance);

        if (cache) {
            if (cache.has(trait)) {
                if (JFACTORY_LOG) {
                    console.warn(`${trait.name} already called on`, callerInstance);
                }
                return this;
            } else {
                cache.add(trait);
            }
        } else {
            JFactoryTraits.CACHE.set(callerInstance, new WeakSet([trait]));
        }

        !callerConstructor.JFactoryTrait && (callerConstructor.JFactoryTrait = new WeakSet);

        if (!callerConstructor.JFactoryTrait.has(trait)) {
            callerConstructor.JFactoryTrait.add(trait);
            this.export(trait.prototype, callerConstructor.prototype);
            this.export(trait, callerConstructor, true);
        }

        // In a Trait.constructor(callerInstance, ...args) : this != callerInstance
        // In a Trait.trait_constructor(...args) : this == callerInstance (traits is injected and available)

        // Traits are injections. They are not dynamic inheritance.
        // So the Trait.constructor() doesn't share the "this" keyword with its caller.

        // #limitation# No way to bind an ES6 class constructor to an object
        // => Implementer can define a "trait_constructor()" that is automatically bound to "callerInstance"
        // and called after the native trait constructor().

        // eslint-disable-next-line new-cap
        let traitInstance = new trait(callerInstance, ...traitArgs);
        if (traitInstance.trait_constructor) {
            traitInstance.trait_constructor.apply(callerInstance, traitArgs);
        }
        return this
    }

    export(source, target, isStatic) {
        let sourceDescriptor = Object.getOwnPropertyDescriptors(source);

        for (let propertyName of Object.keys(sourceDescriptor)) {
            let prefix = JFactoryTraits.getPrefix(propertyName);

            if (JFactoryTraits.getTarget(propertyName, target, prefix)) {
                let propertyDescriptor = sourceDescriptor[propertyName];
                let parsed = (this.options.parser || JFactoryTraits.defaultParser)(
                    propertyName, propertyDescriptor, source, target, isStatic
                );
                if (parsed) {
                    ({ propertyName, propertyDescriptor } = parsed);
                    Object.defineProperty(target, propertyName, propertyDescriptor);
                }
            }
        }
    }

    static defaultParser(propertyName, propertyDescriptor, source, target, isStatic) {
        let value = propertyDescriptor.value;

        if (isStatic) {return null} // don't export static members

        if (propertyName in target) { // skip existing properties
            if (JFACTORY_LOG) {
                console.warn(
                    `${target.constructor.name}> skipping export of existing property "${propertyName}"`,
                    value);
            }
            return null
        }

        if (typeof value === "object") { // prevent shared object exportation
            if (JFACTORY_LOG) {
                console.warn(
                    `${target.constructor.name}> skipping export of shared object "${propertyName}"`,
                    value);
            }
            return null;
        }

        return { propertyName, propertyDescriptor }
    }

    static getPrefix(key) {
        let split = key.split("_");
        return split.length > 1 ? split[0] : null;
    }

    static getTarget(key, target, prefix) {
        if (
            JFactoryTraits.EXCLUDES.includes(key) ||
            prefix === "trait"
        ) {
            return null
        }

        return target
    }
}

JFactoryTraits.CACHE = new WeakMap;
JFactoryTraits.EXCLUDES = ["constructor", "prototype", "length", "size"];

export { JFactoryTraits };
//# sourceMappingURL=JFactoryTraits.mjs.map

/*!
 * jFactory-devel v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
import { jFactoryTraits } from './jFactory-traits.mjs';

// ---------------------------------------------------------------------------------------------------------------------
// Predefined Components
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

/**
 * @mixes TraitCore
 * @mixes TraitAbout
 * @mixes TraitLog
 * @mixes TraitEvents
 * @mixes TraitState
 * @mixes TraitService
 * @mixes TraitTask
 */
class JFactoryCoreObject {
    constructor(name) {
        JFactoryCoreObject.inject(this, JFactoryCoreObject, name);
    }

    static inject(target, constructor, name) {
        jFactoryTraits(target, constructor)
            .use(jFactory.TraitCore)
            .use(jFactory.TraitAbout, { name })
            .use(jFactory.TraitLog)
            .use(jFactory.TraitEvents)
            .use(jFactory.TraitState)
            .use(jFactory.TraitService)
            .use(jFactory.TraitTask);
    }
}

/**
 * @mixes TraitFetch
 * @mixes TraitDOM
 * @mixes TraitCSS
 * @mixes TraitMutation
 * @mixes TraitTimeout
 * @mixes TraitInterval
 * @mixes TraitLibVue
 * @mixes TraitLibReact
 */
class JFactoryComponent extends JFactoryCoreObject {
    constructor(name) {
        super(name);
        JFactoryComponent.inject(this, JFactoryComponent);
    }

    static inject(target, constructor) {
        jFactoryTraits(target, constructor)
            .use(jFactory.TraitFetch)
            .use(jFactory.TraitDOM)
            .use(jFactory.TraitCSS)
            .use(jFactory.TraitMutation)
            .use(jFactory.TraitTimeout)
            .use(jFactory.TraitInterval)
            .use(jFactory.TraitLibVue)
            .use(jFactory.TraitLibReact);
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// jFactory
// ---------------------------------------------------------------------------------------------------------------------

/** @return {JFactoryComponent} */
const jFactory = (name, properties) => Object.assign(new JFactoryComponent(name), properties);

export { JFactoryComponent, JFactoryCoreObject, jFactory };
//# sourceMappingURL=jFactory.mjs.map

/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { jFactoryTraits } from "./jFactory-traits";

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
export class JFactoryCoreObject {
    constructor(name) {
        jFactoryTraits(this, JFactoryCoreObject)
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
export class JFactoryComponent extends JFactoryCoreObject {
    constructor(name) {
        super(name);

        jFactoryTraits(this, JFactoryComponent)
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
export const jFactory = (name, properties) => Object.assign(new JFactoryComponent(name), properties);
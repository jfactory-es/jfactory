/**
 * -----------------------------------------------------------------------------------------------------------------
 * JFactoryComponents
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */
import { jFactoryTraits } from "../jFactory-traits.mjs";
import { jFactoryCfg } from "../jFactory-config.mjs";

import {
    TraitAbout,
    TraitCore,
    TraitEvents,
    TraitLog,
    TraitService,
    TraitState,
    TraitTask
} from "../TraitsCore.mjs";

import {
    TraitCSS,
    TraitDOM,
    TraitFetch,
    TraitInterval,
    TraitLibReact,
    TraitLibVue,
    TraitMutation,
    TraitTimeout
} from "../TraitsComponents.mjs";

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
        JFactoryCoreObject.inject(this, JFactoryCoreObject, name)
    }

    static inject(target, constructor, name) {
        jFactoryTraits(target, constructor)
            .use(TraitCore)
            .use(TraitAbout, { name })
            .use(TraitLog)
            .use(TraitEvents)
            .use(TraitState)
            .use(TraitService)
            .use(TraitTask);
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
        JFactoryComponent.inject(this, JFactoryComponent)
    }

    static inject(target, constructor) {
        jFactoryTraits(target, constructor)
        .use(TraitFetch)
        .use(TraitDOM)
        .use(TraitCSS)
        .use(TraitMutation)
        .use(TraitTimeout)
        .use(TraitInterval)
        .use(TraitLibVue)
        .use(TraitLibReact);
    }
}

// -----------------------------------------------------------------------------------------------------------------
// Config jFactory baseComponent
// -----------------------------------------------------------------------------------------------------------------

jFactoryCfg('jFactory', { baseComponent: JFactoryComponent });
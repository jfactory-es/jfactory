'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jFactoryTraits = require('../jFactory-traits.cjs');
const jFactoryConfig = require('../jFactory-config.cjs');
const TraitsCore = require('../TraitsCore.cjs');
const TraitsComponents = require('../TraitsComponents.cjs');

/**
 * -----------------------------------------------------------------------------------------------------------------
 * JFactoryComponents
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

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
        jFactoryTraits.jFactoryTraits(target, constructor)
            .use(TraitsCore.TraitCore)
            .use(TraitsCore.TraitAbout, { name })
            .use(TraitsCore.TraitLog)
            .use(TraitsCore.TraitEvents)
            .use(TraitsCore.TraitState)
            .use(TraitsCore.TraitService)
            .use(TraitsCore.TraitTask);
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
        jFactoryTraits.jFactoryTraits(target, constructor)
        .use(TraitsComponents.TraitFetch)
        .use(TraitsComponents.TraitDOM)
        .use(TraitsComponents.TraitCSS)
        .use(TraitsComponents.TraitMutation)
        .use(TraitsComponents.TraitTimeout)
        .use(TraitsComponents.TraitInterval)
        .use(TraitsComponents.TraitLibVue)
        .use(TraitsComponents.TraitLibReact);
    }
}

// -----------------------------------------------------------------------------------------------------------------
// Config jFactory baseComponent
// -----------------------------------------------------------------------------------------------------------------

jFactoryConfig.jFactoryCfg('jFactory', { baseComponent: JFactoryComponent });

exports.JFactoryComponent = JFactoryComponent;
exports.JFactoryCoreObject = JFactoryCoreObject;

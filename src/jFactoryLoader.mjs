/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

// ---------------------------------------------------------------------------------------------------------------------
// jFactoryLoader
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

let seq = [];
export function jFactoryLoader_init() {
    if (seq) {
        for (let handler of seq) {
            handler()
        }
        seq = null;
        delete globalThis.jFactoryOverride
    }
}

export function jFactoryLoader_onInit(handler) {
    seq.push(handler)
}
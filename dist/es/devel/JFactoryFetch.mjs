/*!
 * jFactory-devel v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
import { JFACTORY_ERR_REQUEST_ERROR } from './JFactoryError.mjs';
import { JFactoryPromise } from './JFactoryPromise.mjs';
import { jFactoryCompat_require, JFACTORY_COMPAT_AbortController, JFACTORY_COMPAT_Request, JFACTORY_COMPAT_fetch } from './jFactory-compat.mjs';

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryFetch
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

class JFactoryFetch extends JFactoryPromise {

    constructor(optionalArgs, url, fetchOptions = {}) {
        if (typeof optionalArgs === "function") {
            super(optionalArgs);
        } else {
            if (typeof optionalArgs === "string") {
                [optionalArgs, url, fetchOptions] = [{}, arguments[0], arguments[1]];
            }

            let fetchRequest = new Request(url, fetchOptions);

            super(optionalArgs, (resolve, reject) => {
                let promise = fetch(fetchRequest)
                    .then(response => {
                        this.$chain.fetchResponse = response;
                        if (!response.ok) {
                            throw Error(response.status + ":" + response.statusText);
                        }
                        return response
                    });

                if (fetchOptions.$typeText) {
                    promise = promise
                        .then(response => response.text())
                        .then(r => this.$chain.responseText = r);
                }
                else if (fetchOptions.$typeJSON) {
                    promise = promise
                        .then(response => response.json())
                        .then(r => this.$chain.responseJSON = r);
                }

                promise = promise.catch(reason => {
                    throw new JFACTORY_ERR_REQUEST_ERROR({
                        reason: reason.message || reason,
                        target: this.$chain.fetchResponse && this.$chain.fetchResponse.url || url,
                        owner: this,
                        fetchOptions,
                        fetchRequest,
                        fetchResponse: this.$chain.fetchResponse || null
                    }, optionalArgs.traceSource)
                });

                promise.then(resolve, reject);
            });

            this.$chain.fetchOptions = fetchOptions;
            this.$chain.fetchRequest = fetchRequest;

            let abortCtrl = fetchOptions.abortController || new AbortController();
            fetchOptions.signal = abortCtrl.signal;
            this.$chain.fetchAbortController = abortCtrl;
        }
    }

    $chainAbort(reason = "request aborted") {
        super.$chainAbort(reason);
        this.$chain.fetchAbortController.abort();
        return this
    }
}

jFactoryCompat_require(
    JFACTORY_COMPAT_fetch,
    JFACTORY_COMPAT_Request,
    JFACTORY_COMPAT_AbortController
);

export { JFactoryFetch };
//# sourceMappingURL=JFactoryFetch.mjs.map

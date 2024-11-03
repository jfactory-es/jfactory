'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const JFactoryError = require('./JFactoryError.cjs');
const JFactoryPromise = require('./JFactoryPromise.cjs');
const jFactoryCompat = require('../jFactory-compat.cjs');

/**
 * -----------------------------------------------------------------------------------------------------------------
 * JFactoryFetch
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

class JFactoryFetch extends JFactoryPromise.JFactoryPromise {

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
                    throw new JFactoryError.JFACTORY_ERR_REQUEST_ERROR({
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

jFactoryCompat.jFactoryCompat_require(
    jFactoryCompat.JFACTORY_COMPAT_fetch,
    jFactoryCompat.JFACTORY_COMPAT_Request,
    jFactoryCompat.JFACTORY_COMPAT_AbortController
);

exports.JFactoryFetch = JFactoryFetch;

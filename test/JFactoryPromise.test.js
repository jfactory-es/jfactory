const { expect } = require("../scripts/dev/test-utils");

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryTraits
// ---------------------------------------------------------------------------------------------------------------------

const { JFactoryPromise, jFactoryError } = require("../dist");

describe("JFactoryPromise", function() {

    // it("$chainAbort set $isAborted on aborted promises", async function() {
    // });

    // it("$chainComplete does not set $isAborted", async function() {
    // });

    it("should ignore then() handler and return expired error if expired", async function() {
        let promise;
        promise = JFactoryPromise.resolve(110);
        promise.$chainComplete();
        expect(promise.$isSettled).equal(true);
        expect(promise.$isExpired).equal(true);
        expect(promise.$isAborted).equal(false);
        let fail = false;
        let a = await promise.then(() => fail = true);
        expect(a).instanceof(jFactoryError.PROMISE_EXPIRED);
        expect(fail).equal(false)
    });

    it("$chainComplete() should produce an error on pending chain", async function() {
        let promise;

        promise = new JFactoryPromise(r=>r(110)).then(r=>r+1);
        expect(promise.$isSettled).equal(false);
        expect(promise.$isExpired).equal(false);
        expect(promise.$isAborted).equal(false);

        let error = false;
        try {
            promise.$chainComplete();
        } catch (e) {
            error = e;
        }
        expect(error).instanceof(jFactoryError.INVALID_CALL);

        expect(promise.$isSettled).equal(false);
        expect(promise.$isExpired).equal(false);
        expect(promise.$isAborted).equal(false);
    });

    it("should not abort on complete", async function() {
        let promise;

        promise = JFactoryPromise.resolve(111);
        expect(promise.$isSettled).equal(true);
        expect(promise.$isExpired).equal(false);
        expect(promise.$isAborted).equal(false);
        promise.$chainComplete();
        expect(promise.$isSettled).equal(true);
        expect(promise.$isExpired).equal(true);
        expect(promise.$isAborted).equal(false);

        promise = new JFactoryPromise(r=>r(111));
        expect(promise.$isSettled).equal(true);
        expect(promise.$isExpired).equal(false);
        expect(promise.$isAborted).equal(false);
        promise.$chainComplete();
        expect(promise.$isSettled).equal(true);
        expect(promise.$isExpired).equal(true);
        expect(promise.$isAborted).equal(false);

        promise = new JFactoryPromise(r=>r(110)).then(r=>r+1);
        await promise;
        expect(promise.$isSettled).equal(true);
        expect(promise.$isExpired).equal(false);
        expect(promise.$isAborted).equal(false);
    });

    it("[await aborted] throws error", async function() {
        let error = false;
        let promise = JFactoryPromise.resolve(110).then(r=>r+1);
        expect(promise.$isSettled).equal(false);
        expect(promise.$isExpired).equal(false);
        expect(promise.$isAborted).equal(false);
        promise.$chainAbort();
        expect(promise.$isSettled).equal(true);
        expect(promise.$isExpired).equal(true);
        expect(promise.$isAborted).equal(true);

        try {
            await promise;
        } catch (e) {
            error = e;
        }
        expect(error).instanceof(jFactoryError.PROMISE_EXPIRED);
    });

    it("[await expired] doesn't throw error", async function() {
        let error = false;
        let promise = JFactoryPromise.resolve(111);
        expect(promise.$isSettled).equal(true);
        expect(promise.$isExpired).equal(false);
        expect(promise.$isAborted).equal(false);
        promise.$chainComplete();
        expect(promise.$isSettled).equal(true);
        expect(promise.$isExpired).equal(true);
        expect(promise.$isAborted).equal(false);

        try {
            await promise;
        } catch (e) {
            error = e;
        }
        expect(error).equal(false)
    });
});
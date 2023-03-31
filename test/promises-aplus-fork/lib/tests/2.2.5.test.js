/*jshint strict: false */

import {
  describe,
  assert,
  specify
} from "../../../../scripts/test/test-import.mjs";

var adapter = global.adapter;
var resolved = adapter.resolved;
var rejected = adapter.rejected;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `this` value).", function () {
    describe("strict mode", function () {
        specify("fulfilled", function (done) {
            resolved(dummy).then(function onFulfilled() {
                "use strict";

                assert.strictEqual(this, undefined);
                done();
            });
        });

        specify("rejected", function (done) {
            rejected(dummy).then(null, function onRejected() {
                "use strict";

                assert.strictEqual(this, undefined);
                done();
            });
        });
    });

    // not working with compiled test suite since module is in strict mode
    // describe("sloppy mode", function () {
    //     specify("fulfilled", function (done) {
    //         resolved(dummy).then(function onFulfilled() {
    //             assert.strictEqual(this, global);
    //             done();
    //         });
    //     });
    //
    //     specify("rejected", function (done) {
    //         rejected(dummy).then(null, function onRejected() {
    //             assert.strictEqual(this, global);
    //             done();
    //         });
    //     });
    // });
});

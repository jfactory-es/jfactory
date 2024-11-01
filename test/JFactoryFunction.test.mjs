import {
    jFactoryModule,
    describe, it, expect,
    wait
} from "../scripts/test/test-import.mjs";

const {
    JFactoryPromise,
    JFactoryFunctionComposer,
    jFactoryFunctionWrappable,
    jFactoryFunctionConditional,
    jFactoryFunctionExpirable
} = jFactoryModule;

describe("JFactoryFunction", function() {

    let f = (a, b, c) => a + b + c;

    // -----------------------------------------------------------------------------------------------------------------
    // Function Composer
    // -----------------------------------------------------------------------------------------------------------------

    describe("JFactoryFunctionComposer", function() {

        it("when last handler returns a JFactoryPromise", async function() {
            let s = "";

            let composer = new JFactoryFunctionComposer();
            composer.first("group1", () => {
                return s += "a";
            });
            composer.last("group1", () => {
                return JFactoryPromise.resolve(123);
            });

            let composite = composer.compose();
            let result = composite();
            expect(result).instanceof(JFactoryPromise);
            expect(await result).equal(123)
        });

        it("when handlers use async functions", async function() {
            let s = "";

            let composer = new JFactoryFunctionComposer();
            composer.first("group1", () => {
                return s += "a";
            });
            composer.last("group1", async () => {
                return 123;
            });

            let composite = composer.compose();
            let result = composite();
            expect(result).instanceof(Promise);
            expect(await result).equal(123)
        });

        it("should run composite functions", function() {
            let s, r, composer = new JFactoryFunctionComposer();
            expect(composer.compose()).instanceof(Function);

            composer.first("group1", () => {
                return s += "a";
            });
            composer.last("group1", () => {
                return s += "b";
            });
            composer.last("group1", () => {
                return s += "c";
            });

            composer.last("group2", () => {
                return s += "f";
            });
            composer.first("group2", () => {
                return s += "e";
            });
            composer.first("group2", () => {
                return s += "d";
            });

            s = "";
            r = composer.compose("group1", "group2")();
            expect(s).equal("abcdef");
            expect(r).equal("abcdef");

            s = "";
            r = composer.compose("group2", "group1")();
            expect(s).equal("defabc");
            expect(r).equal("defabc");
        });

        it("should return a pending promise", async function() {
            let composer = new JFactoryFunctionComposer();
            composer.first("original", async context => f(...context.parameters));
            let result = composer.compose("original")(1, 2, 3);
            expect(result).instanceof(Promise);
            expect(await result).equal(6)
        });

        it("should return a pending promise (chained)", async function() {
            let composer = new JFactoryFunctionComposer();
            let called = false;

            composer.first("A", async function() { // 1
                await wait(0);
                return 1
            });
            composer.first("B", async function(context) { // 2
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(2);
                expect(context.result).equal(1);
                await wait(0);
                expect(context.result).equal(1);
                return wait(0).then(() => called = true).then(() => 111)
            });

            let composed = composer.compose("A", "B");
            let result = composed(1, 2);
            expect(result).instanceof(Promise);
            expect(called).equal(false);
            expect(await result).equal(111);
            expect(called).equal(true);
        });

        it("should mutate parameters", async function() {
            let composer = new JFactoryFunctionComposer();

            composer.first("PRE", context => {
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(2);
                expect(context.parameters[2]).equal(3);
            });
            composer.first("PRE", async context => {
                await wait(1);
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(2);
                expect(context.parameters[2]).equal(0);
                context.parameters[2] = 3
            });
            composer.first("PRE", context => {
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(0);
                expect(context.parameters[2]).equal(0);
                context.parameters[1] = 2
            });

            composer.first("original", context => f(...context.parameters));

            let composed1 = composer.compose("PRE", "original")(1, 0, 0);
            let composed2 = composer.compose("PRE", "original")(1, 0, 0);

            await Promise.all([composed1, composed2]).then(r => {
                expect(r[0]).equal(6);
                expect(r[1]).equal(6);
            });
        });

        it("should mutate result", async function() {
            let composer = new JFactoryFunctionComposer();

            composer.first("POST", context => {
                expect(context.result).equal(3);
                return 6
            });
            composer.first("POST", async context => {
                expect(context.result).equal(2);
                await wait(10);
                expect(context.result).equal(2);
                return 3
            });
            composer.first("POST", context => {
                expect(context.result).equal(1);
                return 2
            });

            composer.first("original", context => f(...context.parameters));

            let composed1 = composer.compose("original", "POST")(1, 0, 0);
            let composed2 = composer.compose("original", "POST")(1, 0, 0);

            await Promise.all([composed1, composed2]).then(r => {
                expect(r[0]).equal(6);
                expect(r[1]).equal(6);
            });
        });

        it("should run a complex case", async function() {
            let composer = new JFactoryFunctionComposer();

            // async > sync > async
            composer.first("PRE", async function(context) { // 5
                expect(context.parameters[0]).equal(0);
                expect(context.parameters[1]).equal(0);
                expect(context.parameters[2]).equal(0);
                expect(this.prop).equal(6);
                await wait(1);
                context.parameters = [1, 2, 3]
            });
            composer.first("PRE", function(context) { // 4
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(2);
                expect(context.parameters[2]).equal(3);
                expect(this.prop).equal(6);
                context.parameters = [0, 0, 0]
            });
            composer.first("PRE", async function(context) { // 3
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(2);
                expect(context.parameters[2]).equal(0);
                expect(this.prop).equal(6);
                await wait(2);
                context.parameters[2] = 3
            });
            composer.first("PRE", async function(context) { // 2
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(0);
                expect(context.parameters[2]).equal(0);
                expect(this.prop).equal(6);
                await wait(1);
                context.parameters[1] = 2
            });
            composer.first("PRE", async function(context) { // 1
                expect(context.parameters[0]).equal(0);
                expect(context.parameters[1]).equal(0);
                expect(context.parameters[2]).equal(0);
                expect(this.prop).equal(6);
                await wait(1);
                context.parameters[0] = 1
            });

            // async > sync > async
            composer.last("POST", async function(context) { // 7
                expect(this.prop).equal(6);
                expect(context.result).equal(6);
                await wait(1);
                return 0
            });
            composer.last("POST", function(context) { // 8
                expect(this.prop).equal(6);
                expect(context.result).equal(0);
                return 1
            });
            composer.last("POST", async function(context) { // 9
                await wait(1);
                expect(this.prop).equal(6);
                expect(context.result).equal(1);
                return 6
            });

            let obj = { composite: composer.compose("PRE", "original", "POST"), prop: 6 };

            composer.first("original", function(context) { // 6
                expect(this.prop).equal(6);
                return f(...context.parameters)
            });

            let result = obj.composite(0, 0, 0);
            expect(result).instanceof(Promise);
            expect(await result).equal(6);
        });
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Function Wrappable
    // -----------------------------------------------------------------------------------------------------------------

    describe("JFactoryFunctionWrappable", function() {
        it("should run a complex case", async function() {

            let wrappable = jFactoryFunctionWrappable(function(a, b, c) {
                expect(this.prop).equal(6);
                return f(a, b, c)
            });

            // async > sync > async
            wrappable.beforeAll(function(context) { // 4
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(2);
                expect(context.parameters[2]).equal(3);
                expect(this.prop).equal(6);
                context.parameters = [0, 0, 0]
            });
            wrappable.beforeAll(async function(context) { // 3
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(2);
                expect(context.parameters[2]).equal(0);
                expect(this.prop).equal(6);
                await wait(2);
                context.parameters[2] = 3
            });
            wrappable.beforeAll(async function(context) { // 2
                expect(context.parameters[0]).equal(1);
                expect(context.parameters[1]).equal(0);
                expect(context.parameters[2]).equal(0);
                expect(this.prop).equal(6);
                await wait(1);
                context.parameters[1] = 2
            });
            wrappable.beforeAll(async function(context) { // 1
                expect(context.parameters[0]).equal(0);
                expect(context.parameters[1]).equal(0);
                expect(context.parameters[2]).equal(0);
                expect(this.prop).equal(6);
                await wait(1);
                context.parameters[0] = 1
            });
            wrappable.justBefore(async function(context) { // 5
                expect(context.parameters[0]).equal(0);
                expect(context.parameters[1]).equal(0);
                expect(context.parameters[2]).equal(0);
                expect(this.prop).equal(6);
                await wait(1);
                context.parameters = [1, 2, 3]
            });

            // async > sync > async
            wrappable.afterAll(function(context) { // 2
                expect(this.prop).equal(6);
                expect(context.result).equal(0);
                return 1
            });
            wrappable.afterAll(async function(context) { // 3
                await wait(1);
                expect(this.prop).equal(6);
                expect(context.result).equal(1);
                return 6
            });
            wrappable.justAfter(async function(context) { // 1
                expect(this.prop).equal(6);
                expect(context.result).equal(6);
                await wait(1);
                return 0
            });

            let obj = { wrappable, prop: 6 };
            let result = obj.wrappable(0, 0, 0);
            expect(result).instanceof(Promise);
            expect(await result).equal(6);
        });
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Function Conditional
    // -----------------------------------------------------------------------------------------------------------------

    describe("JFactoryFunctionConditional", function() {
        let conditional;
        let c, result, pass;
        let f = () => ++c;
        let reset = function() {
            c = 0;
            result = null;
            conditional = jFactoryFunctionConditional(f)
        };

        it("should respect conditions", async function() {

            // no condition
            reset();
            result = conditional();
            expect(c).equal(1);
            expect(result).equal(1);

            // true
            reset();
            conditional.addCondition(() => true);
            result = conditional();
            expect(c).equal(1);
            expect(result).equal(1);

            // false
            reset();
            conditional.addCondition(() => false);
            result = conditional();
            expect(c).equal(0);
            expect(result).equal(undefined);

            // multiple run (conditions returns false then true)
            reset();
            pass = false;
            conditional.addCondition(() => pass);
            result = conditional();
            expect(c).equal(0);
            expect(result).equal(undefined);
            pass = true;
            result = conditional();
            expect(c).equal(1);
            expect(result).equal(1);

            // true false
            reset();
            conditional.addCondition(() => true);
            conditional.addCondition(() => false);
            result = conditional();
            expect(c).equal(0);
            expect(result).equal(undefined);

            // false true
            reset();
            conditional.addCondition(() => false);
            conditional.addCondition(() => true);
            result = conditional();
            expect(c).equal(0);
            expect(result).equal(undefined);

            // true true
            reset();
            conditional.addCondition(() => true);
            conditional.addCondition(() => true);
            result = conditional();
            expect(c).equal(1);
            expect(result).equal(1);

            // false false
            reset();
            conditional.addCondition(() => false);
            conditional.addCondition(() => false);
            result = conditional();
            expect(c).equal(0);
            expect(result).equal(undefined);

            // async false
            reset();
            conditional.addCondition(async () => false);
            result = conditional();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).equal(undefined);

            // async true
            reset();
            conditional.addCondition(async () => true);
            result = conditional();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(1);
            expect(result).equal(1);

            // true async false
            reset();
            conditional.addCondition(() => true);
            conditional.addCondition(async () => false);
            result = conditional();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).equal(undefined);

            // false async true
            reset();
            conditional.addCondition(() => false);
            conditional.addCondition(async () => true);
            result = conditional();
            expect(result).not.instanceof(Promise);
            expect(c).equal(0);
            expect(result).equal(undefined);

            // async false true
            reset();
            conditional.addCondition(async () => false);
            conditional.addCondition(() => true);
            result = conditional();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).equal(undefined);

            // async true false
            reset();
            conditional.addCondition(async () => true);
            conditional.addCondition(() => false);
            result = conditional();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).equal(undefined);

            // async true async false
            reset();
            conditional.addCondition(async () => true);
            conditional.addCondition(async () => false);
            result = conditional();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).equal(undefined);

            // async false async true
            reset();
            conditional.addCondition(async () => false);
            conditional.addCondition(async () => true);
            result = conditional();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).equal(undefined);

            // async true async true
            reset();
            conditional.addCondition(async () => true);
            conditional.addCondition(async () => true);
            result = conditional();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(1);
            expect(result).equal(1);

            // async false async false
            reset();
            conditional.addCondition(async () => false);
            conditional.addCondition(async () => false);
            result = conditional();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).equal(undefined);
        });
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Function Expirable
    // -----------------------------------------------------------------------------------------------------------------

    describe("JFactoryFunctionExpirable", function() {
        let expirable;
        let c, result, expire;
        let f = () => ++c;
        let reset = function() {
            c = 0;
            result = null;
            expirable = jFactoryFunctionExpirable(f);
        };

        it("should respect conditions", async function() {
            // no condition
            reset();
            result = expirable();
            expect(c).equal(1);
            expect(result).equal(1);
            expect(expirable.isExpired()).equal(false);

            // condition doesn't expire
            reset();
            expirable.addExpireCondition(() => false);
            result = expirable();
            expect(c).equal(1);
            expect(result).equal(1);
            expect(expirable.isExpired()).equal(false);

            // condition expires
            reset();
            expirable.addExpireCondition(() => true);
            result = expirable();
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // run unexpired then run expired
            reset();
            expire = false;
            expirable.addExpireCondition(() => expire);
            result = expirable();
            expect(c).equal(1);
            expect(result).equal(1);
            expect(expirable.isExpired()).equal(false);
            c = 0;
            expire = true;
            result = expirable();
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // true false
            reset();
            expirable.addExpireCondition(() => true);
            expirable.addExpireCondition(() => false);
            result = expirable();
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // false true
            reset();
            expirable.addExpireCondition(() => false);
            expirable.addExpireCondition(() => true);
            result = expirable();
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // true true
            reset();
            expirable.addExpireCondition(() => true);
            expirable.addExpireCondition(() => true);
            result = expirable();
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // false false
            reset();
            expirable.addExpireCondition(() => false);
            expirable.addExpireCondition(() => false);
            result = expirable();
            expect(c).equal(1);
            expect(result).equal(1);
            expect(expirable.isExpired()).equal(false);

            // Async

            // condition doesn't expire
            reset();
            expirable.addExpireCondition(async () => false);
            result = expirable();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(1);
            expect(result).equal(1);
            expect(await expirable.isExpired()).equal(false);

            // condition expires
            reset();
            expirable.addExpireCondition(async () => true);
            result = expirable();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // run unexpired then run expired
            reset();
            expire = false;
            expirable.addExpireCondition(async () => expire);
            result = expirable();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(1);
            expect(result).equal(1);
            expect(await expirable.isExpired()).equal(false);
            c = 0;
            expire = true;
            result = expirable();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // true false
            reset();
            expirable.addExpireCondition(async () => true);
            expirable.addExpireCondition(async () => false);
            result = expirable();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // false true
            reset();
            expirable.addExpireCondition(async () => false);
            expirable.addExpireCondition(async () => true);
            result = expirable();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // true true
            reset();
            expirable.addExpireCondition(async () => true);
            expirable.addExpireCondition(async () => true);
            result = expirable();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(expirable.isExpired()).instanceof(Error);

            // false false
            reset();
            expirable.addExpireCondition(async () => false);
            expirable.addExpireCondition(async () => false);
            result = expirable();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(1);
            expect(result).equal(1);
            expect(await expirable.isExpired()).equal(false);

            // mixed async/sync
            reset();
            expirable.addExpireCondition(() => false);
            expirable.addExpireCondition(async () => true);
            expirable.addExpireCondition(() => false);
            result = expirable();
            expect(result).instanceof(Promise);
            result = await result;
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expect(await expirable.isExpired()).instanceof(Error);
        });

        it("should respect scope and arguments", async function() {
            let f = function(a, b, c) {
                return a + b + c + this.val;
            };
            let obj = {
                expirable: jFactoryFunctionExpirable(f),
                val: 1
            };

            let result = obj.expirable(1, 2, 3);
            expect(result).equal(7);

            obj.expirable.addExpireCondition(function(){
                this.val = 2;
                return false
            });
            result = obj.expirable(1, 2, 3);
            expect(result).equal(8)
        });

        it("should get/set expired status", async function() {

            // run expired then invert expired flag
            reset();
            expire = true;
            expirable.addExpireCondition(() => expire);
            result = expirable();
            expect(expirable.isExpired()).instanceof(Error);
            expect(c).equal(0);
            expect(result).instanceof(Error);
            expirable.setExpired(false);
            expire = false;
            result = expirable();
            expect(expirable.isExpired()).equal(false);
            expect(c).equal(1);
            expect(result).equal(1);

            // run not expired then invert flag
            reset();
            expire = false;
            expirable.addExpireCondition(() => expire);
            result = expirable();
            expect(expirable.isExpired()).equal(false);
            expect(c).equal(1);
            expect(result).equal(1);
            expirable.setExpired(false);
            c = 0;
            expire = true;
            result = expirable();
            expect(expirable.isExpired()).instanceof(Error);
            expect(c).equal(0);
            expect(result).instanceof(Error);

            // force expired flag without handlers
            reset();
            expirable.setExpired(true);
            result = expirable();
            expect(expirable.isExpired()).instanceof(Error);
            expect(c).equal(0);
            expect(result).instanceof(Error);
            //--
            expirable.setExpired(false);
            result = expirable();
            expect(expirable.isExpired()).equal(false);
            expect(c).equal(1);
            expect(result).equal(1);
            c = 0;
            //--
            expirable.setExpired(true);
            result = expirable();
            expect(expirable.isExpired()).instanceof(Error);
            expect(c).equal(0);
            expect(result).instanceof(Error);

            // get valid expired flag without running the function
            reset();
            expirable.addExpireCondition(() => true);
            expect(expirable.isExpired()).instanceof(Error);
            reset();
            expirable.addExpireCondition(() => false);
            expect(expirable.isExpired()).equal(false);
        });

        it("should increment/reset expiredCalls", async function() {
            reset();
            expirable.addExpireCondition(() => expire);

            expire = true;
            expect(expirable.expirable.expiredCalls).equal(0);
            expirable();
            expect(expirable.expirable.expiredCalls).equal(1);
            expirable();
            expect(expirable.expirable.expiredCalls).equal(2);
            expirable.setExpired(false); // reset expiredCalls
            expect(expirable.isExpired()).instanceof(Error); // but condition still expires
            expect(expirable.expirable.expiredCalls).equal(0);
            expirable();
            expect(expirable.expirable.expiredCalls).equal(1);

            expire = false;
            expirable.setExpired(false); // reset expiredCalls
            expect(expirable.isExpired()).equal(false);
            expect(expirable.expirable.expiredCalls).equal(0);
            expirable();
            expect(expirable.expirable.expiredCalls).equal(0);
        });
    });
});
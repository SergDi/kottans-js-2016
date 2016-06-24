var assert = require("assert");
Promise = require('../promise.js');

function promised(val) {
    return new Promise(function (f) {
        setTimeout(function () {
            f(val);
        }, 1);
    });
}

function thenabled(val) {
    return {
        then: function (f) {
            setTimeout(function () {
                f(val);
            }, 1);
        }
    };
}


describe("Promise.reduce", function () {

    it("should allow returning values", function () {
        var a = [promised(1), promised(2), promised(3)];

        return Promise.reduce(a, function (total, a) {
            return total + a + 5;
        }, 0).then(function (total) {
            assert.equal(total, 1 + 5 + 2 + 5 + 3 + 5);
        });
    });

    it("should allow returning promises", function () {
        var a = [promised(1), promised(2), promised(3)];

        return Promise.reduce(a, function (total, a) {
            return promised(5).then(function (b) {
                return total + a + b;
            });
        }, 0).then(function (total) {
            assert.equal(total, 1 + 5 + 2 + 5 + 3 + 5);
        });
    });

    it("should allow returning thenables", function () {
        var b = [1, 2, 3];
        var a = [];

        return Promise.reduce(b, function (total, cur) {
            a.push(cur);
            return thenabled(3);
        }, 0).then(function (total) {
            assert.equal(total, 3);
            assert.deepEqual(a, b);
        });
    });

    it("propagates error", function () {
        var a = [promised(1), promised(2), promised(3)];
        var e = new Error("asd");
        return Promise.reduce(a, function (total, a) {
            if (a > 2) {
                throw e;
            }
            return total + a + 5;
        }, 0).then(assert.fail, function (err) {
            assert.equal(err, e);
        });
    });

});

describe("with no initial accumulator or values", function () {
    it("works when the iterator returns a value", function () {
        return Promise.reduce([], function (total, value) {
            return total + value + 5;
        }).then(function (total) {
            assert.strictEqual(total, undefined);
        });
    });

    it("works when the iterator returns a Promise", function () {
        return Promise.reduce([], function (total, value) {
            return promised(5).then(function (bonus) {
                return total + value + bonus;
            });
        }).then(function (total) {
            assert.strictEqual(total, undefined);
        });
    });

    it("works when the iterator returns a thenable", function () {
        return Promise.reduce([], function (total, value) {
            return thenabled(total + value + 5);
        }).then(function (total) {
            assert.strictEqual(total, undefined);
        });
    });

});


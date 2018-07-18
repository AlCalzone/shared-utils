// tslint:disable:no-unused-expression
// tslint:disable:variable-name

import { assert, expect, should, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { SinonFakeTimers, spy, stub, useFakeTimers } from "sinon";
import * as sinonChai from "sinon-chai";

// enable the should interface with sinon
should();
// improve stubs for testing
use(sinonChai);
use(chaiAsPromised);

import { promiseSequence, promisify, promisifyNoError, wait } from "./async";

/** A callback-style API which returns an error or a boolean */
function callbackApiWithError(returnError: boolean, callback: (err: any, result?: boolean) => void) {
	if (returnError) {
		callback(new Error("you wanted an error!"));
	} else {
		callback(null, true);
	}
}

/** A callback-style API which returns a boolean */
function callbackApiWithoutError(callback: (result: boolean) => void) {
	callback(true);
}

describe("async => ", () => {
	describe("promisify() => ", () => {
		it("should return a function", () => {
			promisify(callbackApiWithError).should.be.a("function");
		});
		it("that returns a promise", () => {
			promisify(callbackApiWithError)(false).should.be.an.instanceof(Promise);
		});

		it("when the callback is invoked with an error, the promise should be rejected", () => {
			const promisified = promisify(callbackApiWithError);
			return expect(promisified(true)).to.eventually.be.rejectedWith("error");
		});

		it("when the callback is invoked with a result, the promise should fulfill with that result", () => {
			const promisified = promisify(callbackApiWithError);
			return expect(promisified(false)).to.eventually.become(true);
		});
	});

	describe("promisifyNoError() => ", () => {
		it("should return a function", () => {
			promisifyNoError(callbackApiWithoutError).should.be.a("function");
		});
		it("that returns a promise", () => {
			promisifyNoError(callbackApiWithoutError)().should.be.an.instanceof(Promise);
		});

		it("that is fulfilled with the first argument passed to the callback", () => {
			const promisified = promisifyNoError(callbackApiWithoutError);
			return expect(promisified()).to.become(true);
		});
	});

	describe("wait() => ", () => {

		let clock: SinonFakeTimers;
		beforeEach(() => {
			clock = useFakeTimers();
		});

		const timeout = 100;

		it(`wait(${timeout}) should wait ${timeout} ms`, (done) => {

			const leSpy = spy();

			wait(timeout).then(() => {
				expect(Date.now()).to.equal(timeout);
				done();
			});
			clock.runAll();

		});

		afterEach(() => {
			clock.restore();
		});
	});

	describe("promiseSequence() => ", () => {
		let clock: SinonFakeTimers;
		beforeEach(() => {
			clock = useFakeTimers();
		});

		it("should execute the given promises in a sequence", (done) => {
			const leSpy = spy();
			function doWait(time, result) {
				return new Promise(res => {
					setTimeout(() => {
						leSpy(result);
						res(result);
					}, time);
					clock.runAll();
				});
			}
			// create an array of promise factories that would usually not finish in order
			const factories = [
				() => doWait(300, 1),
				() => doWait(100, 2),
				() => doWait(200, 3),
				() => doWait(50, 4),
			];
			promiseSequence(factories).then(() => {
				leSpy.callCount.should.equal(4);
				leSpy.getCall(0).args[0].should.equal(1);
				leSpy.getCall(1).args[0].should.equal(2);
				leSpy.getCall(2).args[0].should.equal(3);
				leSpy.getCall(3).args[0].should.equal(4);
				done();
			});
			clock.runAll();
		});

		it("should return an array with the ordered results of the promises", async () => {
			const expected = [4, 2, 1, 3];
			const factories = expected.map(val => () => Promise.resolve(val));
			const result = await promiseSequence(factories);
			result.should.deep.equal(expected);
		});

		it("should work for empty arrays", async () => {
			expect(await promiseSequence([])).to.deep.equal([]);
		});

		afterEach(() => {
			clock.restore();
		});
	});
});

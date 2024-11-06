import {
	expect,
	describe,
	it,
	vi,
	beforeEach,
	afterEach,
} from "vitest";
import { promiseSequence, promisify, promisifyNoError, wait } from ".";

/** A callback-style API which returns an error or a boolean */
function callbackApiWithError(
	returnError: boolean,
	callback: (err: any, result?: boolean) => void,
) {
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
			expect(promisify(callbackApiWithError)).to.be.a("function");
		});
		it("that returns a promise", () => {
			expect(promisify(callbackApiWithError)(false)).to.be.an.instanceof(
				Promise,
			);
		});

		it("when the callback is invoked with an error, the promise should be rejected", () => {
			const promisified = promisify(callbackApiWithError);
			return expect(promisified(true)).rejects.toThrowError("error");
		});

		it("when the callback is invoked with a result, the promise should fulfill with that result", () => {
			const promisified = promisify(callbackApiWithError);
			return expect(promisified(false)).resolves.toBe(true);
		});
	});

	describe("promisifyNoError() => ", () => {
		it("should return a function", () => {
			expect(promisifyNoError(callbackApiWithoutError)).to.be.a(
				"function",
			);
		});
		it("that returns a promise", () => {
			expect(
				promisifyNoError(callbackApiWithoutError)(),
			).to.be.an.instanceof(Promise);
		});

		it("that is fulfilled with the first argument passed to the callback", () => {
			const promisified = promisifyNoError(callbackApiWithoutError);
			return expect(promisified()).resolves.toBe(true);
		});
	});

	describe("wait() => ", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		const timeout = 100;

		it(`wait(${timeout}) should wait ${timeout} ms`, () => {
			return new Promise<void>((done) => {
				const leSpy = vi.fn();
				const start = Date.now();

				wait(timeout).then(() => {
					expect(Date.now() - start).to.equal(timeout);
					done();
				});
				vi.advanceTimersByTime(timeout);
			});
		});

		it(`wait(${timeout}, true) should also wait ${timeout} ms`, () => {
			return new Promise<void>((done) => {
				const leSpy = vi.fn();
				const start = Date.now();

				wait(timeout, true).then(() => {
					expect(Date.now() - start).to.equal(timeout);
					done();
				});
				vi.advanceTimersByTime(timeout);
			});
		});

		afterEach(() => {
			vi.useRealTimers();
		});
	});

	describe("promiseSequence() => ", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		it("should execute the given promises in a sequence", (done) => {
			return new Promise<void>((done) => {
				const leSpy = vi.fn();
				function doWait(
					time: number,
					result: number | {} | PromiseLike<{}>,
				) {
					return new Promise((res) => {
						setTimeout(() => {
							leSpy(result);
							res(result);
						}, time);
						vi.runAllTimers();
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
					expect(leSpy).toHaveBeenCalledTimes(4);
					expect(leSpy.mock.calls[0]).toStrictEqual([1]);
					expect(leSpy.mock.calls[1]).toStrictEqual([2]);
					expect(leSpy.mock.calls[2]).toStrictEqual([3]);
					expect(leSpy.mock.calls[3]).toStrictEqual([4]);
					done();
				});
				vi.runAllTimers();
			});
		});

		it("should return an array with the ordered results of the promises", async () => {
			const expected = [4, 2, 1, 3];
			const factories = expected.map((val) => () => Promise.resolve(val));
			const result = await promiseSequence(factories);
			expect(result).to.deep.equal(expected);
		});

		it("should work for empty arrays", async () => {
			expect(await promiseSequence([])).to.deep.equal([]);
		});

		afterEach(() => {
			vi.useRealTimers();
		});
	});
});

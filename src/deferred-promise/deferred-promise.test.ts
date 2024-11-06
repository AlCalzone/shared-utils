import { expect, describe, it, vi } from "vitest";
import { createDeferredPromise } from ".";

describe("deferred-promise => ", () => {
	describe("createDeferredPromise() => ", () => {
		it("should return a Promise", () => {
			expect(createDeferredPromise()).to.be.an.instanceof(Promise);
		});

		it("should have an external resolve method", () => {
			expect(createDeferredPromise().resolve).to.exist.and.to.be.a(
				"function",
			);
		});

		it("should have an external reject method", () => {
			expect(createDeferredPromise().reject).to.exist.and.to.be.a(
				"function",
			);
		});

		it("calling the resolve method should resolve the promise", async () => {
			const promise = createDeferredPromise();
			const leSpy = vi.fn();
			promise.then(leSpy);

			expect(leSpy).not.toHaveBeenCalled();

			promise.resolve();
			await promise;
		});

		it("calling resolve more than once should not resolve the promise more than once", async () => {
			return new Promise<void>((done) => {
				const promise = createDeferredPromise();
				const leSpy = vi.fn();
				promise.then(leSpy);
				expect(leSpy).not.toHaveBeenCalled();
				promise.resolve();
				setImmediate(() => {
					expect(leSpy).toHaveBeenCalledOnce();
					promise.resolve();
					setImmediate(() => {
						expect(leSpy).toHaveBeenCalledOnce();
						done();
					});
				});
			});
		});

		it("the parameter passed to resolve should become the value of the promise", async () => {
			const promise1 = createDeferredPromise<number>();
			promise1.resolve(1);
			await expect(promise1).resolves.toBe(1);

			const promise2 = createDeferredPromise<number>();
			promise2.resolve(2);
			await expect(promise2).resolves.toBe(2);
		});

		it("calling the reject method should reject the promise", () => {
			const promise = createDeferredPromise();
			const leSpy = vi.fn();
			promise.catch(leSpy);

			expect(leSpy).not.toHaveBeenCalled();

			promise.reject();
			return expect(promise).rejects.toThrowError();
		});

		it("calling reject more than once should not reject the promise more than once", async () => {
			return new Promise<void>((done) => {
				const promise = createDeferredPromise();
				const leSpy = vi.fn();
				promise.catch(leSpy);
				expect(leSpy).not.toHaveBeenCalled;
				promise.reject();
				setImmediate(() => {
					expect(leSpy).toHaveBeenCalledOnce();
					promise.reject();
					setImmediate(() => {
						expect(leSpy).toHaveBeenCalledOnce();
						done();
					});
				});
			});
		});

		it("the parameter passed to reject should become the reason of the rejection", async () => {
			const promise1 = createDeferredPromise<number>();
			promise1.reject("nope!");
			await expect(promise1).rejects.toThrowError("nope");

			const promise2 = createDeferredPromise<number>();
			promise2.reject("no way!");
			await expect(promise2).rejects.toThrowError("no way!");
		});
	});
});

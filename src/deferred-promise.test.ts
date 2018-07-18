// tslint:disable:no-console
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

import { createDeferredPromise } from "./deferred-promise";

describe("deferred-promise => ", () => {

	describe("createDeferredPromise() => ", () => {
		it("should return a Promise", () => {
			createDeferredPromise().should.be.an.instanceof(Promise);
		});

		it("should have an external resolve method", () => {
			expect(createDeferredPromise().resolve).to.exist.and.to.be.a("function");
		});

		it("should have an external reject method", () => {
			expect(createDeferredPromise().reject).to.exist.and.to.be.a("function");
		});

		it("calling the resolve method should resolve the promise", () => {
			const promise = createDeferredPromise();
			const leSpy = spy();
			promise.then(leSpy);

			leSpy.should.not.have.been.called;

			promise.resolve();
			return expect(promise).to.eventually.be.fulfilled;
		});

		it("calling resolve more than once should not resolve the promise more than once", (done) => {
			const promise = createDeferredPromise();
			const leSpy = spy();
			promise.then(leSpy);
			leSpy.should.not.have.been.called;
			promise.resolve();
			setImmediate(() => {
				leSpy.should.have.been.calledOnce;
				promise.resolve();
				setImmediate(() => {
					leSpy.should.have.been.calledOnce;
					done();
				});
			});
		});

		it("the parameter passed to resolve should become the value of the promise", async () => {
			const promise1 = createDeferredPromise<number>();
			promise1.resolve(1);
			await expect(promise1).to.eventually.become(1);

			const promise2 = createDeferredPromise<number>();
			promise2.resolve(2);
			await expect(promise2).to.eventually.become(2);
		});

		it("calling the reject method should reject the promise", () => {
			const promise = createDeferredPromise();
			const leSpy = spy();
			promise.catch(leSpy);

			leSpy.should.not.have.been.called;

			promise.reject();
			return expect(promise).to.eventually.be.rejected;
		});

		it("calling reject more than once should not reject the promise more than once", (done) => {
			const promise = createDeferredPromise();
			const leSpy = spy();
			promise.catch(leSpy);
			leSpy.should.not.have.been.called;
			promise.reject();
			setImmediate(() => {
				leSpy.should.have.been.calledOnce;
				promise.reject();
				setImmediate(() => {
					leSpy.should.have.been.calledOnce;
					done();
				});
			});
		});

		it("the parameter passed to reject should become the reason of the rejection", async () => {
			const promise1 = createDeferredPromise<number>();
			promise1.reject("nope!");
			await expect(promise1).to.be.rejectedWith("nope");

			const promise2 = createDeferredPromise<number>();
			promise2.reject("no way!");
			await expect(promise2).to.be.rejectedWith("no way!");
		});
	});

});

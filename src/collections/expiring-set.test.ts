// tslint:disable:no-unused-expression

import { expect, should, use } from "chai";
import { SinonFakeTimers, spy, stub, useFakeTimers } from "sinon";
should();

import { ExpiringSet } from ".";

describe("expiring-set => ", () => {
	let clock: SinonFakeTimers;
	beforeEach(() => {
		clock = useFakeTimers();
	});

	afterEach(() => {
		clock.restore();
	});

	it("the constructor throws if an invalid expiry time is passed", () => {
		expect(() => new ExpiringSet(0)).to.throw("positive integer");
		expect(() => new ExpiringSet(-1)).to.throw("positive integer");
		expect(() => new ExpiringSet(0.5)).to.throw("positive integer");
	});

	it("should contain all items passed to it in the constructor and no others", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const set = new ExpiringSet(1, containedItems);
		for (const item of containedItems) {
			set.has(item).should.be.true;
		}

		const nonContainedItems = [6, 3, 7, 10, -1, 0];
		for (const item of nonContainedItems) {
			set.has(item).should.be.false;
		}
	});

	it("should have the same length as the array passed in the constructor", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const set = new ExpiringSet(1, containedItems);
		set.size.should.equal(containedItems.length);
	});

	it("should be iterated in the same order as a normal Set", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const expected = [...new Set(containedItems)];
		const actual = new ExpiringSet(1, containedItems);
		let i = 0;
		for (const item of actual) {
			expect(item).to.equal(expected[i]);
			i++;
		}
	});

	it("entries() should contain the same items as the Set method", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const expected = [...new Set(containedItems).entries()];
		const actual = [...new ExpiringSet(1, containedItems).entries()];
		let i = 0;
		for (const item of actual) {
			expect(item).to.deep.equal(expected[i]);
			i++;
		}
	});

	it("keys() should contain the same items as the Set method", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const expected = [...new Set(containedItems).keys()];
		const actual = [...new ExpiringSet(1, containedItems).keys()];
		let i = 0;
		for (const item of actual) {
			expect(item).to.equal(expected[i]);
			i++;
		}
	});

	it("values() should contain the same items as the Set method", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const expected = [...new Set(containedItems).values()];
		const actual = [...new ExpiringSet(1, containedItems).values()];
		let i = 0;
		for (const item of actual) {
			expect(item).to.equal(expected[i]);
			i++;
		}
	});

	it("forEach() should work like the Set method", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const expected = spy();
		const actual = spy();
		new Set(containedItems).forEach((v1, v2) => expected(v1, v2));
		new ExpiringSet(1, containedItems).forEach((v1, v2) => actual(v1, v2));

		expect(expected.callCount).to.equal(containedItems.length);
		expect(actual.callCount).to.equal(containedItems.length);

		for (let i = 0; i < containedItems.length; i++) {
			expect(expected.getCall(i).args).to.deep.equal(
				actual.getCall(i).args,
			);
		}
	});

	it("after the given expiry time has elapsed, initial elements should be removed", done => {
		const initial = [1, 2, 3, 4];
		const set = new ExpiringSet(100, initial);
		const expiredSpy = spy();
		set.on("expired", expiredSpy);
		setTimeout(() => {
			set.size.should.equal(0);
			for (const val of initial) {
				set.has(val).should.equal(false);
				expiredSpy.should.have.been.calledWith(val);
			}
			done();
		}, 150);
		clock.runAll();
	});

	it("added elements should be expired on their own time", done => {
		const set = new ExpiringSet(100);
		const expiredSpy = spy();
		set.on("expired", expiredSpy);
		setTimeout(() => set.add(5), 50);
		setTimeout(() => {
			set.size.should.equal(1);
			set.has(5).should.be.true;
			expiredSpy.should.not.have.been.calledWith(5);
		}, 100);
		setTimeout(() => {
			set.size.should.equal(0);
			set.has(5).should.be.false;
			expiredSpy.should.have.been.calledWith(5);
			done();
		}, 151);
		clock.runAll();
	});

	it("adding elements multiple times refreshes the expiry", done => {
		const set = new ExpiringSet(100);
		const expiredSpy = spy();
		set.on("expired", expiredSpy);
		set.add(5);
		setTimeout(() => set.add(5), 50);
		setTimeout(() => {
			set.size.should.equal(1);
			set.has(5).should.be.true;
			expiredSpy.should.not.have.been.calledWith(5);
		}, 101);
		setTimeout(() => {
			set.size.should.equal(0);
			set.has(5).should.be.false;
			expiredSpy.should.have.been.calledWith(5);
			done();
		}, 151);
		clock.runAll();
	});

	it("the expired callback should not be called for deleted elements", done => {
		const set = new ExpiringSet(100);
		const expiredSpy = spy();
		set.on("expired", expiredSpy);
		set.add(2);
		setTimeout(() => set.delete(2), 50);
		setTimeout(() => {
			set.size.should.equal(0);
			set.has(2).should.be.false;
			expiredSpy.should.not.have.been.called;
			done();
		}, 150);
		clock.runAll();
	});

	it("the expired callback should not be called after the set has been cleared", done => {
		const set = new ExpiringSet(100, [1, 2, 3]);
		const expiredSpy = spy();
		set.on("expired", expiredSpy);
		setTimeout(() => set.clear(), 50);
		setTimeout(() => {
			set.size.should.equal(0);
			expiredSpy.should.not.have.been.called;
			done();
		}, 150);
		clock.runAll();
	});

	it("delete returns false for expired elements", done => {
		const set = new ExpiringSet(100);
		set.add(2);
		setTimeout(() => {
			set.delete(2).should.equal(false);
			done();
		}, 150);
		clock.runAll();
	});

});

import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { ExpiringSet } from ".";

describe("expiring-set => ", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
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
			expect(set.has(item)).to.be.true;
		}

		const nonContainedItems = [6, 3, 7, 10, -1, 0];
		for (const item of nonContainedItems) {
			expect(set.has(item)).to.be.false;
		}
	});

	it("should have the same length as the array passed in the constructor", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const set = new ExpiringSet(1, containedItems);
		expect(set.size).to.equal(containedItems.length);
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
		const expected = vi.fn();
		const actual = vi.fn();
		new Set(containedItems).forEach((v1, v2) => expected(v1, v2));
		new ExpiringSet(1, containedItems).forEach((v1, v2) => actual(v1, v2));

		expect(expected).toHaveBeenCalledTimes(containedItems.length);
		expect(actual).toHaveBeenCalledTimes(containedItems.length);

		for (let i = 0; i < containedItems.length; i++) {
			expect(expected.mock.calls[i]).to.deep.equal(actual.mock.calls[i]);
		}
	});

	it("after the given expiry time has elapsed, initial elements should be removed", () => {
		const initial = [1, 2, 3, 4];
		const set = new ExpiringSet(100, initial);
		const expiredSpy = vi.fn();
		set.on("expired", expiredSpy);

		return new Promise<void>((done) => {
			setTimeout(() => {
				expect(set.size).to.equal(0);
				for (const val of initial) {
					expect(set.has(val)).to.be.false;
					expect(expiredSpy).toHaveBeenCalledWith(val);
				}
				done();
			}, 150);
			vi.runAllTimers();
		});
	});

	it("added elements should be expired on their own time", () => {
		const set = new ExpiringSet(100);
		const expiredSpy = vi.fn();
		set.on("expired", expiredSpy);

		return new Promise<void>((done) => {
			setTimeout(() => set.add(5), 50);
			setTimeout(() => {
				expect(set.size).toBe(1);
				expect(set.has(5)).toBe(true);
				expect(expiredSpy).not.toHaveBeenCalledWith(5);
			}, 100);
			setTimeout(() => {
				expect(set.size).toBe(0);
				expect(set.has(5)).toBe(false);
				expect(expiredSpy).toHaveBeenCalledWith(5);
				done();
			}, 151);
			vi.runAllTimers();
		});
	});

	it("adding elements multiple times refreshes the expiry", () => {
		const set = new ExpiringSet(100);
		const expiredSpy = vi.fn();
		set.on("expired", expiredSpy);
		set.add(5);

		return new Promise<void>((done) => {
			setTimeout(() => set.add(5), 50);
			setTimeout(() => {
				expect(set.size).toBe(1);
				expect(set.has(5)).toBe(true);
				expect(expiredSpy).not.toHaveBeenCalledWith(5);
			}, 101);
			setTimeout(() => {
				expect(set.size).toBe(0);
				expect(set.has(5)).toBe(false);
				expect(expiredSpy).toHaveBeenCalledWith(5);
				done();
			}, 151);
			vi.runAllTimers();
		});
	});

	it("the expired callback should not be called for deleted elements", () => {
		const set = new ExpiringSet(100);
		const expiredSpy = vi.fn();
		set.on("expired", expiredSpy);
		set.add(2);

		return new Promise<void>((done) => {
			setTimeout(() => set.delete(2), 50);
			setTimeout(() => {
				expect(set.size).toBe(0);
				expect(set.has(2)).toBe(false);
				expect(expiredSpy).not.toHaveBeenCalled();
				done();
			}, 150);
			vi.runAllTimers();
		});
	});

	it("the expired callback should not be called after the set has been cleared", () => {
		const set = new ExpiringSet(100, [1, 2, 3]);
		const expiredSpy = vi.fn();
		set.on("expired", expiredSpy);

		return new Promise<void>((done) => {
			setTimeout(() => set.clear(), 50);
			setTimeout(() => {
				expect(set.size).toBe(0);
				expect(expiredSpy).not.toHaveBeenCalled();
				done();
			}, 150);
			vi.runAllTimers();
		});
	});

	it("delete returns false for expired elements", () => {
		const set = new ExpiringSet(100);
		set.add(2);

		return new Promise<void>((done) => {
			setTimeout(() => {
				expect(set.delete(2)).toBe(false);
				done();
			}, 150);
			vi.runAllTimers();
		});
	});
});

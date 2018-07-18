// tslint:disable:no-console
// tslint:disable:no-unused-expression
// tslint:disable:variable-name

import { assert, expect, should, use } from "chai";
import { SinonFakeTimers, spy, stub, useFakeTimers } from "sinon";
import * as sinonChai from "sinon-chai";

// enable the should interface with sinon
should();
// improve stubs for testing
use(sinonChai);

import { compareNumberOrString, defaultComparer, isComparable } from "./comparable";

describe("comparable => ", () => {
	describe("isComparable() => ", () => {
		it("should return false when null or undefined is passed", () => {
			isComparable(null).should.be.false;
			isComparable(undefined).should.be.false;
		});

		it("should return true when the argument has an isComparable method", () => {
			isComparable({ compareTo: () => undefined }).should.be.true;
		});
		it("should return false when isComparable is not a function", () => {
			isComparable({ compareTo: 1 }).should.be.false;
			isComparable({ compareTo: null }).should.be.false;
			isComparable({ compareTo: [] }).should.be.false;
			isComparable({ compareTo: {} }).should.be.false;
		});
	});

	describe("compareNumberOrString() => ", () => {
		it("should return 1 when b > a", () => {
			compareNumberOrString(1, 2).should.equal(1);
			compareNumberOrString("1", "2").should.equal(1);
		});
		it("should return 0 when b === a", () => {
			compareNumberOrString(1, 1).should.equal(0);
			compareNumberOrString("1", "1").should.equal(0);
		});
		it("should return -1 when b < a", () => {
			compareNumberOrString(3, 2).should.equal(-1);
			compareNumberOrString("3", "2").should.equal(-1);
		});
	});

	describe("defaultComparer() => ", () => {
		it("when both arguments are a number or string, it should return the result of compareNumberOrString()", () => {
			defaultComparer(1, 2).should.equal(compareNumberOrString(1, 2));
			defaultComparer(1, 1).should.equal(compareNumberOrString(1, 1));
			defaultComparer(2, 1).should.equal(compareNumberOrString(2, 1));
			defaultComparer("1", "2").should.equal(compareNumberOrString("1", "2"));
			defaultComparer("1", "1").should.equal(compareNumberOrString("1", "1"));
			defaultComparer("2", "1").should.equal(compareNumberOrString("2", "1"));
		});
		it("should throw when the arguments are of a different primitive type", () => {
			expect(() => defaultComparer(1, undefined)).to.throw("cannot compare");
			expect(() => defaultComparer("1", undefined)).to.throw("cannot compare");
			expect(() => defaultComparer(true, undefined)).to.throw("cannot compare");
			expect(() => defaultComparer(1, null)).to.throw("cannot compare");
			expect(() => defaultComparer("1", null)).to.throw("cannot compare");
			expect(() => defaultComparer(true, null)).to.throw("cannot compare");
			expect(() => defaultComparer(undefined, 1)).to.throw("cannot compare");
			expect(() => defaultComparer(undefined, "1")).to.throw("cannot compare");
			expect(() => defaultComparer(undefined, true)).to.throw("cannot compare");
			expect(() => defaultComparer(null, 1)).to.throw("cannot compare");
			expect(() => defaultComparer(null, "1")).to.throw("cannot compare");
			expect(() => defaultComparer(null, true)).to.throw("cannot compare");
			expect(() => defaultComparer(1, "1" as any)).to.throw("cannot compare");
			expect(() => defaultComparer("1", 1 as any)).to.throw("cannot compare");
			expect(() => defaultComparer(1, true as any)).to.throw("cannot compare");
			expect(() => defaultComparer(true, 1 as any)).to.throw("cannot compare");
			expect(() => defaultComparer("1", true as any)).to.throw("cannot compare");
			expect(() => defaultComparer(true, "1" as any)).to.throw("cannot compare");
		});
		it("should throw when the arguments are not comparable", () => {
			expect(() => defaultComparer(undefined, undefined)).to.throw("cannot compare");
			// two non-primitives are comparable, when both have a `compareTo` method
			const comparable = { compareTo: () => void 0 } as any;
			const nonComparable = { foo: false } as any;
			expect(() => defaultComparer(comparable, nonComparable)).to.throw("cannot compare");
			expect(() => defaultComparer(nonComparable, comparable)).to.throw("cannot compare");
			expect(() => defaultComparer(nonComparable, nonComparable)).to.throw("cannot compare");
		});
		it("when both arguments are a Comparable<T>, b.compareTo(a) should be returned", () => {
			const b = { compareTo: stub() };
			const a = { compareTo: stub() };

			for (const expected of [-1, 0, 1]) {
				b.compareTo.returns(expected);
				defaultComparer(a, b).should.equal(expected);
				b.compareTo.should.have.been.called;
				b.compareTo.resetHistory();
			}
			a.compareTo.should.not.have.been.called;
		});
	});
});

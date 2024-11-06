import { expect, describe, it, vi } from "vitest";
import { compareNumberOrString, defaultComparer, isComparable } from ".";

describe("comparable => ", () => {
	describe("isComparable() => ", () => {
		it("should return false when null or undefined is passed", () => {
			expect(isComparable(null)).to.be.false;
			expect(isComparable(undefined)).to.be.false;
		});

		it("should return true when the argument has an isComparable method", () => {
			expect(isComparable({ compareTo: () => undefined })).to.be.true;
		});
		it("should return false when isComparable is not a function", () => {
			expect(isComparable({ compareTo: 1 })).to.be.false;
			expect(isComparable({ compareTo: null })).to.be.false;
			expect(isComparable({ compareTo: [] })).to.be.false;
			expect(isComparable({ compareTo: {} })).to.be.false;
		});
	});

	describe("compareNumberOrString() => ", () => {
		it("should return 1 when b > a", () => {
			expect(compareNumberOrString(1, 2)).to.equal(1);
			expect(compareNumberOrString("1", "2")).to.equal(1);
		});
		it("should return 0 when b === a", () => {
			expect(compareNumberOrString(1, 1)).to.equal(0);
			expect(compareNumberOrString("1", "1")).to.equal(0);
		});
		it("should return -1 when b < a", () => {
			expect(compareNumberOrString(3, 2)).to.equal(-1);
			expect(compareNumberOrString("3", "2")).to.equal(-1);
		});
	});

	describe("defaultComparer() => ", () => {
		it("when both arguments are a number or string, it should return the result of compareNumberOrString()", () => {
			expect(defaultComparer(1, 2)).to.equal(compareNumberOrString(1, 2));
			expect(defaultComparer(1, 1)).to.equal(compareNumberOrString(1, 1));
			expect(defaultComparer(2, 1)).to.equal(compareNumberOrString(2, 1));
			expect(defaultComparer("1", "2")).to.equal(
				compareNumberOrString("1", "2"),
			);
			expect(defaultComparer("1", "1")).to.equal(
				compareNumberOrString("1", "1"),
			);
			expect(defaultComparer("2", "1")).to.equal(
				compareNumberOrString("2", "1"),
			);
		});
		it("should throw when the arguments are of a different primitive type", () => {
			expect(() => defaultComparer(1, undefined)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer("1", undefined)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(true, undefined)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(1, null)).to.throw("cannot compare");
			expect(() => defaultComparer("1", null)).to.throw("cannot compare");
			expect(() => defaultComparer(true, null)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(undefined, 1)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(undefined, "1")).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(undefined, true)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(null, 1)).to.throw("cannot compare");
			expect(() => defaultComparer(null, "1")).to.throw("cannot compare");
			expect(() => defaultComparer(null, true)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(1, "1" as any)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer("1", 1 as any)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(1, true as any)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(true, 1 as any)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer("1", true as any)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(true, "1" as any)).to.throw(
				"cannot compare",
			);
		});
		it("should throw when the arguments are not comparable", () => {
			expect(() => defaultComparer(undefined, undefined)).to.throw(
				"cannot compare",
			);
			// two non-primitives are comparable, when both have a `compareTo` method
			const comparable = { compareTo: () => void 0 } as any;
			const nonComparable = { foo: false } as any;
			expect(() => defaultComparer(comparable, nonComparable)).to.throw(
				"cannot compare",
			);
			expect(() => defaultComparer(nonComparable, comparable)).to.throw(
				"cannot compare",
			);
			expect(() =>
				defaultComparer(nonComparable, nonComparable),
			).to.throw("cannot compare");
		});
		it("when both arguments are a Comparable<T>, b.compareTo(a) should be returned", () => {
			const b = { compareTo: vi.fn() };
			const a = { compareTo: vi.fn() };

			for (const expected of [-1, 0, 1]) {
				b.compareTo.mockReturnValue(expected);
				expect(defaultComparer(a, b)).to.equal(expected);
				expect(b.compareTo).toHaveBeenCalled();
				b.compareTo.mockReset();
			}
			expect(a.compareTo).not.toHaveBeenCalled();
		});
	});
});

import { assert, expect } from "chai";
import { isArray, isObject } from ".";
import type { Equals } from "../types";
// tslint:disable:no-unused-expression

// Used to tests types
function assertTrue<T extends true>() {
	return undefined!;
}
function assertFalse<T extends false>() {
	return undefined!;
}

describe("lib/typeguards =>", () => {
	describe("isObject() => ", () => {
		it("should return true for object literals", () => {
			isObject({}).should.be.true;
			isObject({ a: "b" }).should.be.true;
		});

		it("should return true for Object instances", () => {
			isObject(new Object()).should.be.true;
		});

		it("should return false for Arrays", () => {
			isObject([]).should.be.false;
			isObject(new Array()).should.be.false;
		});

		it("should return false for everything else", () => {
			[null, undefined, 1, 2, 3, "1", "2", "3", true, false].forEach(
				(val) => isObject(val).should.be.false,
			);
		});

		it("should allow sub-indexing objects", () => {
			const foo = { a: { b: "c" } } as unknown;
			isObject(foo) && isObject(foo.a) && isObject(foo.a.b);
		});
	});

	describe("isArray() => ", () => {
		function doTest() {
			it("should return true for array literals", () => {
				isArray([]).should.be.true;
				isArray([1, 2, 3]).should.be.true;
			});

			it("should return true for Array instances", () => {
				isArray(new Array()).should.be.true;
			});

			it("should return false for everything else", () => {
				[
					{},
					new Object(),
					new Buffer(0),
					null,
					undefined,
					1,
					2,
					3,
					"1",
					"2",
					"3",
					true,
					false,
				].forEach((val) => isArray(val).should.be.false);
			});
		}

		describe(`with native support for "Array.isArray"`, () => {
			doTest();
		});

		describe(`without native support for "Array.isArray"`, () => {
			const originalIsArray = Array.isArray;

			before(() => ((Array.isArray as any) = undefined));
			doTest();
			after(() => (Array.isArray = originalIsArray));
		});

		it("should allow working with the narrowed array", () => {
			const foo = ["a", "b", "c"] as string | string[];
			isArray(foo) && foo[0];
		});

		it("inferred types are correct", () => {
			const _any = undefined as any;
			const _unknown = undefined as unknown;
			const _unknownArray = _unknown as unknown[];
			const _number = _unknown as number;
			const _numberArray = _unknown as number[];
			const _readonlyNumberArray = _unknown as readonly number[];

			if (isArray(_any)) {
				assertTrue<Equals<typeof _any, any>>();
				_any;
				// ^?
			}

			if (isArray(_unknown)) {
				assertTrue<Equals<typeof _unknown, unknown[]>>();
				_unknown;
				// ^?
			}

			if (isArray(_unknownArray)) {
				assertTrue<Equals<typeof _unknownArray, unknown[]>>();
				_unknownArray;
				// ^?
			}

			if (isArray(_number)) {
				assertTrue<Equals<typeof _number, never>>();
				_number;
				// ^?
			}

			if (isArray(_numberArray)) {
				assertTrue<Equals<typeof _numberArray, number[]>>();
				_numberArray;
				// ^?
			}

			if (isArray(_readonlyNumberArray)) {
				assertTrue<
					Equals<typeof _readonlyNumberArray, readonly number[]>
				>();
				_readonlyNumberArray;
				// ^?
			}
		});
	});
});

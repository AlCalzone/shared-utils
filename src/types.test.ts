// tslint:disable:no-console
// tslint:disable:no-unused-expression
// tslint:disable:variable-name

// tslint:disable:interface-over-type-literal

import { assert, expect, should, use } from "chai";
import { SinonFakeTimers, spy, stub, useFakeTimers } from "sinon";
import * as sinonChai from "sinon-chai";

// enable the should interface with sinon
should();
// improve stubs for testing
use(sinonChai);

import { And, AssignableTo, Equals, Every, EveryStrict, Head, IndizesOf, IsTuple, KeyValuePairsOf, LengthOf, Not, Omit, Optional, Or, SemiPartial, Tail, UnionOf, Unshift } from "./types";

// These tests all succeed during runtime
// a failed test can only occur due to compile errors
describe.only("types => ", () => {

	describe("AssignableTo<T1, T2> => ", () => {

		it("should return true if T1 equals T2", () => {
			type Tests = [
				// number and numeric literals
				AssignableTo<1, 1>,
				AssignableTo<number, number>,
				// string and string literals
				AssignableTo<"", "">,
				AssignableTo<"1", "1">,
				AssignableTo<string, string>,
				// boolean and boolean literals
				AssignableTo<true, true>,
				AssignableTo<false, false>,
				AssignableTo<boolean, boolean>,
				// object and object literals
				AssignableTo<{}, {}>,
				AssignableTo<{ a: number }, { a: number }>,
				AssignableTo<object, object>,
				// unions
				AssignableTo<1 | "2" | boolean, 1 | "2" | boolean>,
				// tuples
				AssignableTo<[1, "2", string], [1, "2", string]>,
				// undefined, null, never
				AssignableTo<null, undefined>,
				AssignableTo<undefined, undefined>,
				AssignableTo<null, null>,
				AssignableTo<never, never>,
				AssignableTo<void, void>,
				AssignableTo<unknown, unknown>,
				// Generics
				AssignableTo<Promise<void>, Promise<void>>,
				AssignableTo<AssignableTo<1, 1>, AssignableTo<2, 2>>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return true if T1 is a specialisation of T2", () => {
			type Tests = [
				// number and numeric literals
				AssignableTo<1, number>,
				AssignableTo<2, number>,
				// string and string literals
				AssignableTo<"", string>,
				AssignableTo<"1", string>,
				// boolean and boolean literals
				AssignableTo<true, boolean>,
				AssignableTo<false, boolean>,
				// object and object literals
				AssignableTo<{ a: number }, {}>,
				AssignableTo<{ a: number, b: any }, { a: number }>,
				AssignableTo<{ a: number }, object>,
				// unions
				AssignableTo<1, 1 | "2" | boolean>,
				AssignableTo<"2", 1 | "2" | boolean>,
				AssignableTo<1 | boolean, 1 | "2" | boolean>,
				AssignableTo<"2" | boolean, 1 | "2" | boolean>,
				AssignableTo<1 | "2", 1 | "2" | boolean>,
				// tuples
				AssignableTo<[1, "2", string], [1, "2", string?]>,
				AssignableTo<[1, "2", string], [1, "2", ...string[]]>,
				// anything can be assigned to void
				AssignableTo<null, void>,
				AssignableTo<undefined, void>,
				AssignableTo<never, void>,
				AssignableTo<void, void>,
				// or unknown
				AssignableTo<null, unknown>,
				AssignableTo<undefined, unknown>,
				AssignableTo<void, unknown>,
				AssignableTo<never, unknown>,
				// Generics
				AssignableTo<Promise<1>, Promise<number>>,
				AssignableTo<AssignableTo<1, 1>, boolean>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return false if T1 cannot be assigned to T2", () => {
			type Tests = [
				// number and numeric literals
				AssignableTo<1, 2>,
				AssignableTo<number, 1>,
				// string and string literals
				AssignableTo<string, "1">,
				AssignableTo<"", "1">,
				// boolean and boolean literals
				AssignableTo<true, false>,
				AssignableTo<false, true>,
				AssignableTo<boolean, true>,
				AssignableTo<boolean, false>,
				// object and object literals
				AssignableTo<{ a: number }, { b: number }>,
				AssignableTo<{ a: number }, { a: string }>,
				AssignableTo<object, { a: number }>,
				// unions
				AssignableTo<1 | "2" | boolean, 1 | "2">,
				// tuples
				AssignableTo<[1, "2", string], [1, "2", boolean]>,
				AssignableTo<[], [1]>,
				AssignableTo<[1, "2", string], [1, 2]>,
				AssignableTo<[number, string, boolean], [1, "2", boolean]>,
				// nothing is assignable to never
				AssignableTo<undefined, never>,
				AssignableTo<null, never>,
				AssignableTo<void, never>,
				AssignableTo<unknown, never>,
				// void and unknown cannot be assigned
				AssignableTo<void, null>,
				AssignableTo<void, undefined>,
				AssignableTo<unknown, null>,
				AssignableTo<unknown, undefined>,
				AssignableTo<unknown, void>,
				// Generics
				AssignableTo<Promise<boolean>, Promise<void>>,
				AssignableTo<AssignableTo<1, 1>, AssignableTo<1, 2>>
			];

			const success: Every<Tests, false> = true;
		});
	});

	describe("Equals<T1, T2> => ", () => {
		it("should return true for identical types", () => {
			type Tests = [
				// number and numeric literals
				Equals<1, 1>,
				Equals<number, number>,
				// string and string literals
				Equals<"", "">,
				Equals<"1", "1">,
				Equals<string, string>,
				// boolean and boolean literals
				Equals<true, true>,
				Equals<false, false>,
				Equals<boolean, boolean>,
				// object and object literals
				Equals<{}, {}>,
				Equals<{ a: number }, { a: number }>,
				Equals<object, object>,
				// unions
				Equals<1 | "2" | boolean, 1 | "2" | boolean>,
				// tuples
				Equals<[1, "2", string], [1, "2", string]>,
				// undefined, null, never
				Equals<null, undefined>,
				Equals<undefined, undefined>,
				Equals<null, null>,
				Equals<never, never>,
				Equals<void, void>,
				Equals<unknown, unknown>,
				// Generics
				Equals<Promise<void>, Promise<void>>,
				Equals<Equals<1, 1>, Equals<2, 2>>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return false for non-identical types", () => {
			type Tests = [
				// number and numeric literals
				Equals<1, 2>,
				Equals<1, number>,
				Equals<number, 2>,
				// string and string literals
				Equals<"", string>,
				Equals<string, "1">,
				Equals<"", "1">,
				// boolean and boolean literals
				Equals<true, false>,
				Equals<false, true>,
				Equals<boolean, true>,
				Equals<false, boolean>,
				// object and object literals
				Equals<{}, { a: number }>,
				Equals<{ a: number }, { b: number }>,
				Equals<{ a: number }, { a: string }>,
				Equals<{ a: number }, object>,
				// unions
				Equals<1 | "2" | boolean, 1 | "2">,
				// tuples
				Equals<[1, "2", string], [1, "2", boolean]>,
				// undefined, null, never
				Equals<undefined, never>,
				Equals<null, never>,
				Equals<void, null>,
				Equals<undefined, void>,
				Equals<void, unknown>,
				Equals<never, unknown>,
				Equals<never, void>,
				// Generics
				Equals<Promise<void>, Promise<boolean>>,
				Equals<Equals<1, 1>, Equals<1, 2>>
			];

			const success: Every<Tests, false> = true;
		});
	});

	describe("Not<T> => ", () => {
		it("should return false if T is true", () => {
			const success: Not<true> = false;
		});

		it("should return true if T is false", () => {
			const success: Not<false> = true;
		});

		it("should return boolean if T is boolean", () => {
			let test: Not<boolean>;
			test = true;
			test = false;
		});
	});

	describe("And<T1, T2> => ", () => {
		it("should return the result of a logical AND combination if both arguments are boolean literals", () => {
			type Tests = [
				Equals<And<true, true>, true>,
				Equals<And<true, false>, false>,
				Equals<And<false, true>, false>,
				Equals<And<false, false>, false>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return boolean if one argument is the boolean type and the other isn't false", () => {
			type Tests = [
				Equals<And<true, boolean>, boolean>,
				Equals<And<false, boolean>, false>,
				Equals<And<boolean, true>, boolean>,
				Equals<And<boolean, false>, false>,
				Equals<And<boolean, boolean>, boolean>
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("Or<T1, T2> => ", () => {
		it("should return the result of a logical AND combination if both arguments are boolean literals", () => {
			type Tests = [
				Equals<Or<true, true>, true>,
				Equals<Or<true, false>, true>,
				Equals<Or<false, true>, true>,
				Equals<Or<false, false>, false>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return boolean if one argument is the boolean type and the other isn't true", () => {
			type Tests = [
				Equals<Or<true, boolean>, true>,
				Equals<Or<false, boolean>, boolean>,
				Equals<Or<boolean, true>, true>,
				Equals<Or<boolean, false>, boolean>,
				Equals<Or<boolean, boolean>, boolean>
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("Every<TArr[], T> => ", () => {
		it("should return true if all elements in the type array are assignable to the given type", () => {
			type Tests = [
				// number and numeric literals
				Every<1[], 1>,
				Every<number[], number>,
				// string and string literals
				Every<""[], "">,
				Every<string[], string>,
				// boolean and boolean literals
				Every<true[], true>,
				Every<false[], false>,
				Every<boolean[], boolean>,
				// object and object literals
				Every<{}[], {}>,
				Every<{ a: number }[], { a: number }>,
				Every<object[], object>,
				// unions
				Every<(1 | "2" | boolean)[], 1 | "2" | boolean>,
				// tuples
				Every<[1, "2", string][], [1, "2", string]>,
				Every<[1, "2", string], 1 | "2" | string>,
				Every<[number, number, number], number>,
				Every<[], never>,
				// undefined, null, never
				Every<null[], undefined>,
				Every<undefined[], undefined>,
				Every<null[], null>,
				Every<never[], never>,
				Every<void[], void>,
				Every<unknown[], unknown>,
				// Generics
				Every<Promise<void>[], Promise<void>>,
				Every<Equals<1, 1>[], Equals<2, 2>>
			];

			type AllTrue =
				Tests extends true[] ? true : false;

			const success: AllTrue = true;
		});

		it("should return false if an element in the type array is not assignable to the given type", () => {
			type Tests = [
				// number and numeric literals
				Every<1[], 2>,
				Every<number[], 1>,
				// string and string literals
				Every<string[], "">,
				Every<""[], "1">,
				// boolean and boolean literals
				Every<true[], false>,
				Every<false[], true>,
				Every<boolean[], true>,
				Every<boolean[], false>,
				// object and object literals
				Every<{}[], { a: number }>,
				Every<{ a: number }[], {}>,
				Every<object[], { a: number }>,
				// unions
				Every<(1 | "2" | boolean)[], number | "2">,
				// tuples
				Every<[1, "2", string][], [number, string, "2"]>,
				Every<[], number>,
				// undefined, null, never
				Every<null[], never>,
				Every<null[], void>,
				Every<null[], unknown>,
				Every<undefined[], void>,
				Every<undefined[], never>,
				Every<undefined[], unknown>,
				Every<never[], void>,
				Every<never[], null>,
				Every<never[], undefined>,
				Every<never[], unknown>,
				Every<void[], null>,
				Every<void[], undefined>,
				Every<void[], never>,
				Every<void[], unknown>,
				Every<unknown[], null>,
				Every<unknown[], undefined>,
				Every<unknown[], never>,
				Every<unknown[], void>,
				// Generics
				Every<Promise<void>[], Promise<1>>,
				Every<Equals<1, 1>[], Equals<1, 2>>
			];

			type AllFalse =
				Tests extends false[] ? true : false;

			const success: AllFalse = true;
		});
	});

	describe("EveryStrict<TArr[], T> => ", () => {
		it("should return true if all elements in the type array are strictly equal to the given type", () => {
			type Tests = [
				// number and numeric literals
				EveryStrict<1[], 1>,
				EveryStrict<number[], number>,
				// string and string literals
				EveryStrict<""[], "">,
				EveryStrict<string[], string>,
				// boolean and boolean literals
				EveryStrict<true[], true>,
				EveryStrict<false[], false>,
				EveryStrict<boolean[], boolean>,
				// object and object literals
				EveryStrict<{}[], {}>,
				EveryStrict<{ a: number }[], { a: number }>,
				EveryStrict<object[], object>,
				// unions
				EveryStrict<(1 | "2" | boolean)[], 1 | "2" | boolean>,
				// tuples
				EveryStrict<[1, "2", string][], [1, "2", string]>,
				// this is not strict equality:
				// EveryStrict<[1, "2", string], 1 | "2" | string>,
				EveryStrict<[number, number, number], number>,
				// undefined, null, never
				EveryStrict<null[], undefined>,
				EveryStrict<undefined[], undefined>,
				EveryStrict<null[], null>,
				EveryStrict<never[], never>,
				EveryStrict<void[], void>,
				EveryStrict<unknown[], unknown>,
				// Generics
				EveryStrict<Promise<void>[], Promise<void>>,
				EveryStrict<Equals<1, 1>[], Equals<2, 2>>
			];

			type AllTrue =
				Tests extends true[] ? true : false;

			const success: AllTrue = true;
		});

		it("should return false if an element in the type array is not strictly equal to the given type", () => {
			type Tests = [
				// number and numeric literals
				EveryStrict<1[], number>,
				// string and string literals
				EveryStrict<""[], string>,
				EveryStrict<"1"[], string>,
				// boolean and boolean literals
				EveryStrict<true[], boolean>,
				EveryStrict<false[], boolean>,
				// object and object literals
				EveryStrict<{ a: number }[], object>,
				EveryStrict<{ a: number }[], {}>,
				// unions
				EveryStrict<(1 | "2" | boolean)[], number | string | boolean>,
				// tuples
				EveryStrict<[1, "2", string][], [number, string, string]>,
				EveryStrict<[1, "2", string], 1 | "2" | string>,
				// undefined, null, never
				EveryStrict<null[], void>,
				EveryStrict<null[], unknown>,
				EveryStrict<undefined[], void>,
				EveryStrict<undefined[], unknown>,
				EveryStrict<never[], void>,
				EveryStrict<never[], null>,
				EveryStrict<never[], undefined>,
				EveryStrict<never[], unknown>,
				EveryStrict<void[], unknown>,
				// Generics
				EveryStrict<Promise<1>[], Promise<number>>,
				EveryStrict<Equals<1, 1>[], boolean>
			];

			type AllFalse =
				Tests extends false[] ? true : false;

			const success: AllFalse = true;
		});
	});

	describe("IndizesOf<T[]> => ", () => {
		it("should return never for empty tuples", () => {
			type Tests = [
				// empty tuple
				Equals<IndizesOf<[]>, never>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return the numeric indizes of the given tuple type", () => {
			type Tests = [
				// fixed-length tuples
				Equals<IndizesOf<[number]>, "0">,
				Equals<IndizesOf<[number, number]>, "0" | "1">,
				// open-ended tuples
				Equals<IndizesOf<[number, number, ...string[]]>, "0" | "1" | number>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return `number` for arrays", () => {
			type Tests = [
				// array
				Equals<IndizesOf<number[]>, number>
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("UnionOf<T[]> => ", () => {
		it("should return never for empty tuples", () => {
			type Tests = [
				// empty tuple
				Equals<UnionOf<[]>, never>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return the union of all types in the given Array or tuple type", () => {
			type Tests = [
				// fixed-length tuples
				Equals<UnionOf<[number]>, number>,
				Equals<UnionOf<[number, number]>, number>,
				// mixed tuples
				Equals<UnionOf<[number, string]>, number | string>,
				// open-ended tuples
				Equals<UnionOf<[number, number, ...string[]]>, number | string>,
				// arrays
				Equals<UnionOf<(number | string | true)[]>, number | string | true>
			];

			const success: Every<Tests, true> = true;
		});

	});

	describe("LengthOf<T[]> => ", () => {
		it("should return 0 for empty tuples", () => {
			type Tests = [
				// empty tuple
				Equals<LengthOf<[]>, 0>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return the actual length of fixed-length tuples", () => {
			type Tests = [
				// fixed-length tuples
				Equals<LengthOf<[number]>, 1>,
				Equals<LengthOf<[number, number]>, 2>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return `number` for arrays and open-ended tuples", () => {
			type Tests = [
				// array
				Equals<LengthOf<number[]>, number>,
				// open-ended tuples
				Equals<LengthOf<[number, number, ...string[]]>, number>
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("IsTuple<T[]> => ", () => {
		it("should return true for empty tuples", () => {
			type Tests = [
				// empty tuple
				Equals<IsTuple<[]>, true>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return true for fixed-length and open-ended tuples", () => {
			type Tests = [
				// fixed-length tuples
				Equals<IsTuple<[number]>, true>,
				Equals<IsTuple<[number, number]>, true>,
				// open-ended tuples
				Equals<IsTuple<[number, number, ...string[]]>, true>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return false for arrays", () => {
			type Tests = [
				// array
				Equals<IsTuple<number[]>, false>
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("Omit<T, K> => ", () => {
		it("should work on empty objects", () => {
			type Tests = [
				Equals<Omit<{}, never>, {}>,
				Equals<Omit<{}, "something">, {}>,
				Equals<Omit<{}, "some" | "props">, {}>
			];

			const success: Every<Tests, true> = true;
		});

		it("should keep existing properties if they are not to be excluded", () => {
			type Tests = [
				Equals<Omit<{ a: number }, never>, { a: number }>,
				Equals<Omit<{ a: number, b: string[] }, "something">, { a: number, b: string[] }>,
				Equals<Omit<{ a: number, b: string[] }, "some" | "props">, { a: number, b: string[] }>
			];

			const success: Every<Tests, true> = true;
		});

		it("should keep remove the properties in the keys union from the type", () => {
			type Tests = [
				Equals<Omit<{ a: number }, "a">, {}>,
				Equals<Omit<{ a: number, b: string[] }, "a">, { b: string[] }>,
				Equals<Omit<{ a: number, b: string[] }, "a" | "b">, {}>,
				Equals<Omit<{ a: number, b: string[], c: any }, "a" | "b">, { c: any }>
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("Optional<T, K> => ", () => {
		it("should work on empty objects", () => {
			type Tests = [
				Equals<Optional<{}, never>, {}>,
				Equals<Optional<{}, "something">, {}>,
				Equals<Optional<{}, "some" | "props">, {}>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return an empty objects if no properties from K exist on T", () => {
			type Tests = [
				Equals<Optional<{ a: number }, never>, {}>,
				Equals<Optional<{ a: number, b: string[] }, "something">, {}>,
				Equals<Optional<{ a: number, b: string[] }, "some" | "props">, {}>
			];

			const success: Every<Tests, true> = true;
		});

		it("should take all properties in K from T and make them optional", () => {
			type Tests = [
				Equals<Optional<{ a: number }, "a">, { a?: number }>,
				Equals<Optional<{ a: number, b: string[] }, "a">, { a?: number }>,
				Equals<Optional<{ a: number, b: string[] }, "a" | "b">, { a?: number, b?: string[] }>
			];

			const success: Every<Tests, true> = true;
		});

	});

	describe("SemiPartial<T, K> => ", () => {
		it("should work on empty objects", () => {
			type Tests = [
				Equals<SemiPartial<{}, never>, {}>
			];

			const success: Every<Tests, true> = true;
		});

		it("should take all properties in K from T and make them optional WHILE keeping the rest", () => {
			type Tests = [
				Equals<SemiPartial<{ a: number }, "a">, { a?: number }>,
				Equals<SemiPartial<{ a: number, b: string[] }, "a">, { a?: number, b: string[] }>,
				Equals<SemiPartial<{ a: number, b: string[] }, "a" | "b">, { a?: number, b?: string[] }>
			];

			const success: Every<Tests, true> = true;
		});

	});

	describe("KeyValuePairsOf<T> => ", () => {
		it("should return never for empty objects", () => {
			type Tests = [
				Equals<KeyValuePairsOf<{}>, never> // empty union
			];

			const success: Every<Tests, true> = true;
		});

		it("should create a union with all {key, value} pairs", () => {
			type Tests = [
				Equals<KeyValuePairsOf<{ a: 1 }>, { key: "a", value: 1 }>,
				Equals<KeyValuePairsOf<{ a: 1, b: 2 }>, { key: "a", value: 1 } | { key: "b", value: 2 }>
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("Head<T[]> => ", () => {
		it("should return never for empty arrays/tuples", () => {
			type Tests = [
				Equals<Head<[]>, never>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return the first item's type", () => {
			type Tests = [
				Equals<Head<[1]>, 1>,
				Equals<Head<[1, 2]>, 1>,
				Equals<Head<[3, 2, number]>, 3>
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("Tail<T[]> => ", () => {
		it("should return an empty tuple for tuples/arrays with length less than 2", () => {
			type Tests = [
				Equals<Tail<[]>, []>,
				Equals<Tail<[1]>, []>,
				Equals<Tail<[number]>, []>
			];

			const success: Every<Tests, true> = true;
		});

		it("should return a tuple of all but the first item's type", () => {
			type Tests = [
				Equals<Tail<[1, 2]>, [2]>,
				Equals<Tail<[3, 2, number]>, [2, number]>,
				// open-ended tuples
				Equals<Tail<[number, ...string[]]>, string[]>,
				Equals<Tail<[number, boolean, ...string[]]>, [boolean, ...string[]]>,
				Equals<Tail<[...string[]]>, string[]>,
				// arrays
				Equals<Tail<string[]>, string[]>
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("Unshift<T[], I> => ", () => {
		it("should prepend the given element to the tuple/array", () => {
			type Tests = [
				Equals<Unshift<[], 1>, [1]>,
				Equals<Unshift<[1], 2>, [2, 1]>,
				Equals<Unshift<[number, string], boolean>, [boolean, number, string]>
			];

			const success: Every<Tests, true> = true;
		});

	});

	// describe("Reverse<T[]> => ", () => {
	// 	it("should work with empty arrays/tuples", () => {
	// 		type Tests = [
	// 			Equals<Reverse<[]>, []>
	// 		];

	// 		const success: Every<Tests, true> = true;
	// 	});

	// 	it("should return the first item's type", () => {
	// 		type Tests = [
	// 			Equals<Reverse<[1]>, [1]>,
	// 			Equals<Reverse<[1, 2]>, [2, 1]>,
	// 			Equals<Reverse<[3, 2, number]>, [number, 2, 3]>
	// 		];

	// 		const success: Every<Tests, true> = true;
	// 	});
	// });

	// describe("Push<T[], I> => ", () => {
	// 	it("should append the given element to the tuple/array", () => {
	// 		type Tests = [
	// 			Equals<Push<[], 1>, [1]>,
	// 			Equals<Push<[1], 2>, [1, 2]>,
	// 			Equals<Push<[number, string], boolean>, [number, string, boolean]>
	// 		];

	// 		const success: Every<Tests, true> = true;
	// 	});

	// });

});

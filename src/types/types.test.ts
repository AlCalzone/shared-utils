// tslint:disable:no-console
// tslint:disable:no-unused-expression
// tslint:disable:variable-name

// TSLint seems to have problems with whitespace in rest tuples
// tslint:disable:whitespace

// tslint:disable:interface-over-type-literal

import { should, use } from "chai";
import * as sinonChai from "sinon-chai";

// enable the should interface with sinon
should();
// improve stubs for testing
use(sinonChai);

import {
	And,
	ArgumentAt,
	AssignableTo,
	CallbackAPIReturnType,
	Equals,
	Every,
	EveryStrict,
	FixedIndizesOf,
	Head,
	IndizesOf,
	IsFixedLength,
	IsGreaterThan,
	IsGreaterThanOrEqual,
	IsLessThan,
	IsLessThanOrEqual,
	IsTuple,
	IsVariableLength,
	KeyValuePairsOf,
	Last,
	LastArgument,
	Lead,
	LengthOf,
	NoInfer,
	Not,
	Omit,
	Optional,
	Or,
	Overwrite,
	Promisify,
	Range,
	RangeFrom,
	SemiPartial,
	Simplify,
	Tail,
	TupleOf,
	UnionOf,
	Unshift
} from ".";

// Used to tests types
function assertTrue<T extends true>() { return undefined!; }
function assertFalse<T extends false>() { return undefined!; }

// These tests all succeed during runtime
// a failed test can only occur due to compile errors
describe("types => ", () => {

	describe("AssignableTo<T1, T2> => ", () => {

		it("should return true if T1 equals T2", () => {
			// number and numeric literals
			assertTrue<AssignableTo<1, 1>>();
			assertTrue<AssignableTo<number, number>>();
			// string and string literals
			assertTrue<AssignableTo<"", "">>();
			assertTrue<AssignableTo<"1", "1">>();
			assertTrue<AssignableTo<string, string>>();
			// boolean and boolean literals
			assertTrue<AssignableTo<true, true>>();
			assertTrue<AssignableTo<false, false>>();
			assertTrue<AssignableTo<boolean, boolean>>();
			// object and object literals
			assertTrue<AssignableTo<{}, {}>>();
			assertTrue<AssignableTo<{ a: number }, { a: number }>>();
			assertTrue<AssignableTo<object, object>>();
			// unions
			assertTrue<AssignableTo<1 | "2" | boolean, 1 | "2" | boolean>>();
			// tuples
			assertTrue<AssignableTo<[1, "2", string], [1, "2", string]>>();
			// undefined, null, never
			// assertTrue<AssignableTo<null, undefined>>();
			assertTrue<AssignableTo<undefined, undefined>>();
			assertTrue<AssignableTo<null, null>>();
			assertTrue<AssignableTo<never, never>>();
			assertTrue<AssignableTo<void, void>>();
			assertTrue<AssignableTo<unknown, unknown>>();
			// Generics
			assertTrue<AssignableTo<Promise<void>, Promise<void>>>();
			assertTrue<AssignableTo<AssignableTo<1, 1>, AssignableTo<2, 2>>>();
		});

		it("should return true if T1 is a specialisation of T2", () => {
			// number and numeric literals
			assertTrue<AssignableTo<1, number>>();
			assertTrue<AssignableTo<2, number>>();
			// string and string literals
			assertTrue<AssignableTo<"", string>>();
			assertTrue<AssignableTo<"1", string>>();
			// boolean and boolean literals
			assertTrue<AssignableTo<true, boolean>>();
			assertTrue<AssignableTo<false, boolean>>();
			// object and object literals
			assertTrue<AssignableTo<{ a: number }, {}>>();
			assertTrue<AssignableTo<{ a: number, b: any }, { a: number }>>();
			assertTrue<AssignableTo<{ a: number }, object>>();
			// unions
			assertTrue<AssignableTo<1, 1 | "2" | boolean>>();
			assertTrue<AssignableTo<"2", 1 | "2" | boolean>>();
			assertTrue<AssignableTo<1 | boolean, 1 | "2" | boolean>>();
			assertTrue<AssignableTo<"2" | boolean, 1 | "2" | boolean>>();
			assertTrue<AssignableTo<1 | "2", 1 | "2" | boolean>>();
			// tuples
			assertTrue<AssignableTo<[1, "2", string], [1, "2", string?]>>();
			assertTrue<AssignableTo<[1, "2", string], [1, "2", ...string[]]>>();
			// anything can be assigned to void
			// assertTrue<AssignableTo<null, void>>();
			assertTrue<AssignableTo<undefined, void>>();
			assertTrue<AssignableTo<never, void>>();
			assertTrue<AssignableTo<void, void>>();
			// or unknown
			assertTrue<AssignableTo<null, unknown>>();
			assertTrue<AssignableTo<undefined, unknown>>();
			assertTrue<AssignableTo<void, unknown>>();
			assertTrue<AssignableTo<never, unknown>>();
			// Generics
			assertTrue<AssignableTo<Promise<1>, Promise<number>>>();
			assertTrue<AssignableTo<AssignableTo<1, 1>, boolean>>();
		});

		it("should return false if T1 cannot be assigned to T2", () => {
			// number and numeric literals
			assertFalse<AssignableTo<1, 2>>();
			assertFalse<AssignableTo<number, 1>>();
			// string and string literals
			assertFalse<AssignableTo<string, "1">>();
			assertFalse<AssignableTo<"", "1">>();
			// boolean and boolean literals
			assertFalse<AssignableTo<true, false>>();
			assertFalse<AssignableTo<false, true>>();
			assertFalse<AssignableTo<boolean, true>>();
			assertFalse<AssignableTo<boolean, false>>();
			// object and object literals
			assertFalse<AssignableTo<{ a: number }, { b: number }>>();
			assertFalse<AssignableTo<{ a: number }, { a: string }>>();
			assertFalse<AssignableTo<object, { a: number }>>();
			// unions
			assertFalse<AssignableTo<1 | "2" | boolean, 1 | "2">>();
			// tuples
			assertFalse<AssignableTo<[1, "2", string], [1, "2", boolean]>>();
			assertFalse<AssignableTo<[], [1]>>();
			assertFalse<AssignableTo<[1, "2", string], [1, 2]>>();
			assertFalse<AssignableTo<[number, string, boolean], [1, "2", boolean]>>();
			// nothing is assignable to never
			assertFalse<AssignableTo<undefined, never>>();
			assertFalse<AssignableTo<null, never>>();
			assertFalse<AssignableTo<void, never>>();
			assertFalse<AssignableTo<unknown, never>>();
			// void and unknown cannot be assigned
			assertFalse<AssignableTo<void, null>>();
			assertFalse<AssignableTo<void, undefined>>();
			assertFalse<AssignableTo<unknown, null>>();
			assertFalse<AssignableTo<unknown, undefined>>();
			assertFalse<AssignableTo<unknown, void>>();
			// Generics
			assertFalse<AssignableTo<Promise<boolean>, Promise<void>>>();
			assertFalse<AssignableTo<AssignableTo<1, 1>, AssignableTo<1, 2>>>();
		});
	});

	describe("Equals<T1, T2> => ", () => {
		it("should return true for identical types", () => {
			// number and numeric literals
			assertTrue<Equals<1, 1>>();
			assertTrue<Equals<number, number>>();
			// string and string literals
			assertTrue<Equals<"", "">>();
			assertTrue<Equals<"1", "1">>();
			assertTrue<Equals<string, string>>();
			// boolean and boolean literals
			assertTrue<Equals<true, true>>();
			assertTrue<Equals<false, false>>();
			assertTrue<Equals<boolean, boolean>>();
			// object and object literals
			assertTrue<Equals<{}, {}>>();
			assertTrue<Equals<{ a: number }, { a: number }>>();
			assertTrue<Equals<object, object>>();
			// unions
			assertTrue<Equals<1 | "2" | boolean, 1 | "2" | boolean>>();
			// tuples
			assertTrue<Equals<[1, "2", string], [1, "2", string]>>();
			// undefined, null, never
			// assertTrue<Equals<null, undefined>>();
			assertTrue<Equals<undefined, undefined>>();
			assertTrue<Equals<null, null>>();
			assertTrue<Equals<never, never>>();
			assertTrue<Equals<void, void>>();
			assertTrue<Equals<unknown, unknown>>();
			// Generics
			assertTrue<Equals<Promise<void>, Promise<void>>>();
			assertTrue<Equals<Equals<1, 1>, Equals<2, 2>>>();
		});

		it("should return false for non-identical types", () => {
			// number and numeric literals
			assertFalse<Equals<1, 2>>();
			assertFalse<Equals<1, number>>();
			assertFalse<Equals<number, 2>>();
			// string and string literals
			assertFalse<Equals<"", string>>();
			assertFalse<Equals<string, "1">>();
			assertFalse<Equals<"", "1">>();
			// boolean and boolean literals
			assertFalse<Equals<true, false>>();
			assertFalse<Equals<false, true>>();
			assertFalse<Equals<boolean, true>>();
			assertFalse<Equals<false, boolean>>();
			// object and object literals
			assertFalse<Equals<{}, { a: number }>>();
			assertFalse<Equals<{ a: number }, { b: number }>>();
			assertFalse<Equals<{ a: number }, { a: string }>>();
			assertFalse<Equals<{ a: number }, object>>();
			// unions
			assertFalse<Equals<1 | "2" | boolean, 1 | "2">>();
			// tuples
			assertFalse<Equals<[1, "2", string], [1, "2", boolean]>>();
			// undefined, null, never
			assertFalse<Equals<undefined, never>>();
			assertFalse<Equals<null, never>>();
			assertFalse<Equals<void, null>>();
			assertFalse<Equals<undefined, void>>();
			assertFalse<Equals<void, unknown>>();
			assertFalse<Equals<never, unknown>>();
			assertFalse<Equals<never, void>>();
			// Generics
			assertFalse<Equals<Promise<void>, Promise<boolean>>>();
			assertFalse<Equals<Equals<1, 1>, Equals<1, 2>>>();
		});
	});

	describe("Not<T> => ", () => {
		it("should return false if T is true", () => {
			assertFalse<Not<true>>();
		});

		it("should return true if T is false", () => {
			assertTrue<Not<false>>();
		});

		it("should return boolean if T is boolean", () => {
			let test: Not<boolean>;
			test = true;
			test = false;
		});
	});

	describe("And<T1, T2> => ", () => {
		it("should return the result of a logical AND combination if both arguments are boolean literals", () => {
			assertTrue<And<true, true>>();
			assertFalse<And<true, false>>();
			assertFalse<And<false, true>>();
			assertFalse<And<false, false>>();
		});

		it("should return boolean if one argument is the boolean type and the other isn't false", () => {
			assertTrue<Equals<And<true, boolean>, boolean>>();
			assertTrue<Equals<And<false, boolean>, false>>();
			assertTrue<Equals<And<boolean, true>, boolean>>();
			assertTrue<Equals<And<boolean, false>, false>>();
			assertTrue<Equals<And<boolean, boolean>, boolean>>();
		});
	});

	describe("Or<T1, T2> => ", () => {
		it("should return the result of a logical AND combination if both arguments are boolean literals", () => {
			assertTrue<Or<true, true>>();
			assertTrue<Or<true, false>>();
			assertTrue<Or<false, true>>();
			assertFalse<Or<false, false>>();
		});

		it("should return boolean if one argument is the boolean type and the other isn't true", () => {
			assertTrue<Equals<Or<true, boolean>, true>>();
			assertTrue<Equals<Or<false, boolean>, boolean>>();
			assertTrue<Equals<Or<boolean, true>, true>>();
			assertTrue<Equals<Or<boolean, false>, boolean>>();
			assertTrue<Equals<Or<boolean, boolean>, boolean>>();
		});
	});

	describe("Every<TArr[], T> => ", () => {
		it("should return true if all elements in the type array are assignable to the given type", () => {
			// number and numeric literals
			assertTrue<Every<1[], 1>>();
			assertTrue<Every<number[], number>>();
			// string and string literals
			assertTrue<Every<""[], "">>();
			assertTrue<Every<string[], string>>();
			// boolean and boolean literals
			assertTrue<Every<true[], true>>();
			assertTrue<Every<false[], false>>();
			assertTrue<Every<boolean[], boolean>>();
			// object and object literals
			assertTrue<Every<{}[], {}>>();
			assertTrue<Every<{ a: number }[], { a: number }>>();
			assertTrue<Every<object[], object>>();
			// unions
			assertTrue<Every<(1 | "2" | boolean)[], 1 | "2" | boolean>>();
			// tuples
			assertTrue<Every<[1, "2", string][], [1, "2", string]>>();
			assertTrue<Every<[1, "2", string], 1 | "2" | string>>();
			assertTrue<Every<[number, number, number], number>>();
			assertTrue<Every<[], never>>();
			// undefined, null, never
			// assertTrue<Every<null[], undefined>>();
			assertTrue<Every<undefined[], undefined>>();
			assertTrue<Every<null[], null>>();
			assertTrue<Every<never[], never>>();
			assertTrue<Every<void[], void>>();
			assertTrue<Every<unknown[], unknown>>();
			// Generics
			assertTrue<Every<Promise<void>[], Promise<void>>>();
			assertTrue<Every<Equals<1, 1>[], Equals<2, 2>>>();

		});

		it("should return false if an element in the type array is not assignable to the given type", () => {
			// number and numeric literals
			assertFalse<Every<1[], 2>>();
			assertFalse<Every<number[], 1>>();
			// string and string literals
			assertFalse<Every<string[], "">>();
			assertFalse<Every<""[], "1">>();
			// boolean and boolean literals
			assertFalse<Every<true[], false>>();
			assertFalse<Every<false[], true>>();
			assertFalse<Every<boolean[], true>>();
			assertFalse<Every<boolean[], false>>();
			// object and object literals
			assertFalse<Every<{}[], { a: number }>>();
			assertFalse<Every<{ a: number }[], {}>>();
			assertFalse<Every<object[], { a: number }>>();
			// unions
			assertFalse<Every<(1 | "2" | boolean)[], number | "2">>();
			// tuples
			assertFalse<Every<[1, "2", string][], [number, string, "2"]>>();
			assertFalse<Every<[], number>>();
			// undefined, null, never
			assertFalse<Every<null[], never>>();
			assertFalse<Every<null[], void>>();
			assertFalse<Every<null[], unknown>>();
			assertFalse<Every<undefined[], void>>();
			assertFalse<Every<undefined[], never>>();
			assertFalse<Every<undefined[], unknown>>();
			assertFalse<Every<never[], void>>();
			assertFalse<Every<never[], null>>();
			assertFalse<Every<never[], undefined>>();
			assertFalse<Every<never[], unknown>>();
			assertFalse<Every<void[], null>>();
			assertFalse<Every<void[], undefined>>();
			assertFalse<Every<void[], never>>();
			assertFalse<Every<void[], unknown>>();
			assertFalse<Every<unknown[], null>>();
			assertFalse<Every<unknown[], undefined>>();
			assertFalse<Every<unknown[], never>>();
			assertFalse<Every<unknown[], void>>();
			// Generics
			assertFalse<Every<Promise<void>[], Promise<1>>>();
			assertFalse<Every<Equals<1, 1>[], Equals<1, 2>>>();

		});
	});

	describe("EveryStrict<TArr[], T> => ", () => {
		it("should return true if all elements in the type array are strictly equal to the given type", () => {

			// number and numeric literals
			assertTrue<EveryStrict<1[], 1>>();
			assertTrue<EveryStrict<number[], number>>();
			// string and string literals
			assertTrue<EveryStrict<""[], "">>();
			assertTrue<EveryStrict<string[], string>>();
			// boolean and boolean literals
			assertTrue<EveryStrict<true[], true>>();
			assertTrue<EveryStrict<false[], false>>();
			assertTrue<EveryStrict<boolean[], boolean>>();
			// object and object literals
			assertTrue<EveryStrict<{}[], {}>>();
			assertTrue<EveryStrict<{ a: number }[], { a: number }>>();
			assertTrue<EveryStrict<object[], object>>();
			// unions
			assertTrue<EveryStrict<(1 | "2" | boolean)[], 1 | "2" | boolean>>();
			// tuples
			assertTrue<EveryStrict<[1, "2", string][], [1, "2", string]>>();
			// this is not strict equality:
			// EveryStrict<[1, "2", string], 1 | "2" | string>>();
			assertTrue<EveryStrict<[number, number, number], number>>();
			// undefined, null, never
			// assertTrue<EveryStrict<null[], undefined>>();
			assertTrue<EveryStrict<undefined[], undefined>>();
			assertTrue<EveryStrict<null[], null>>();
			assertTrue<EveryStrict<never[], never>>();
			assertTrue<EveryStrict<void[], void>>();
			assertTrue<EveryStrict<unknown[], unknown>>();
			// Generics
			assertTrue<EveryStrict<Promise<void>[], Promise<void>>>();
			assertTrue<EveryStrict<Equals<1, 1>[], Equals<2, 2>>>();
		});

		it("should return false if an element in the type array is not strictly equal to the given type", () => {
			// number and numeric literals
			assertFalse<EveryStrict<1[], number>>();
			// string and string literals
			assertFalse<EveryStrict<""[], string>>();
			assertFalse<EveryStrict<"1"[], string>>();
			// boolean and boolean literals
			assertFalse<EveryStrict<true[], boolean>>();
			assertFalse<EveryStrict<false[], boolean>>();
			// object and object literals
			assertFalse<EveryStrict<{ a: number }[], object>>();
			assertFalse<EveryStrict<{ a: number }[], {}>>();
			// unions
			assertFalse<EveryStrict<(1 | "2" | boolean)[], number | string | boolean>>();
			// tuples
			assertFalse<EveryStrict<[1, "2", string][], [number, string, string]>>();
			assertFalse<EveryStrict<[1, "2", string], 1 | "2" | string>>();
			// undefined, null, never
			// assertFalse<EveryStrict<null[], void>>();
			assertFalse<EveryStrict<null[], unknown>>();
			assertFalse<EveryStrict<undefined[], void>>();
			assertFalse<EveryStrict<undefined[], unknown>>();
			assertFalse<EveryStrict<never[], void>>();
			assertFalse<EveryStrict<never[], null>>();
			assertFalse<EveryStrict<never[], undefined>>();
			assertFalse<EveryStrict<never[], unknown>>();
			assertFalse<EveryStrict<void[], unknown>>();
			// Generics
			assertFalse<EveryStrict<Promise<1>[], Promise<number>>>();
			assertFalse<EveryStrict<Equals<1, 1>[], boolean>>();
		});
	});

	describe("IndizesOf<T[]> => ", () => {
		it("should return never for empty tuples", () => {
			assertTrue<Equals<IndizesOf<[]>, never>>();
		});

		it("should return the numeric indizes of the given tuple type", () => {
			// fixed-length tuples
			assertTrue<Equals<IndizesOf<[number]>, "0">>();
			assertTrue<Equals<IndizesOf<[number, number]>, "0" | "1">>();
			// open-ended tuples
			assertTrue<Equals<IndizesOf<[number, number, ...string[]]>, "0" | "1" | number>>();
		});

		it("should return `number` for arrays", () => {
			assertTrue<Equals<IndizesOf<number[]>, number>>();
		});
	});

	describe("FixedIndizesOf<T[]> => ", () => {
		it("should return never for empty tuples and array-types", () => {
			assertTrue<Equals<FixedIndizesOf<[]>, never>>();
			assertTrue<Equals<FixedIndizesOf<string[]>, never>>();
		});

		it("should return the fixed numeric indizes of the given tuple type", () => {
			// fixed-length tuples
			assertTrue<Equals<FixedIndizesOf<[number]>, "0">>();
			assertTrue<Equals<FixedIndizesOf<[number, number]>, "0" | "1">>();
			// open-ended tuples
			assertTrue<Equals<FixedIndizesOf<[number, boolean?, ...string[]]>, "0" | "1">>();
		});
	});

	describe("UnionOf<T[]> => ", () => {
		it("should return never for empty tuples", () => {
			assertTrue<Equals<UnionOf<[]>, never>>();
		});

		it("should return the union of all types in the given Array or tuple type", () => {
			// fixed-length tuples
			assertTrue<Equals<UnionOf<[number]>, number>>();
			assertTrue<Equals<UnionOf<[number, number]>, number>>();
			// mixed tuples
			assertTrue<Equals<UnionOf<[number, string]>, number | string>>();
			// open-ended tuples
			assertTrue<Equals<UnionOf<[number, number, ...string[]]>, number | string>>();
			// arrays
			assertTrue<Equals<UnionOf<(number | string | true)[]>, number | string | true>>();
		});

	});

	describe("LengthOf<T[]> => ", () => {
		it("should return 0 for empty tuples", () => {
			assertTrue<Equals<LengthOf<[]>, 0>>();
		});

		it("should return the actual length of fixed-length tuples", () => {
			assertTrue<Equals<LengthOf<[number]>, 1>>();
			assertTrue<Equals<LengthOf<[number, number]>, 2>>();
		});

		it("should return `number` for arrays and open-ended tuples", () => {
			// array
			assertTrue<Equals<LengthOf<number[]>, number>>();
			// open-ended tuples
			assertTrue<Equals<LengthOf<[number, number, ...string[]]>, number>>();
		});
	});

	describe("IsFixedLength<T[]> / IsVariableLength<T[]> => ", () => {
		it("should return true / false for empty tuples", () => {
			// empty tuple
			assertTrue<IsFixedLength<[]>>();
			assertFalse<IsVariableLength<[]>>();
		});

		it("should return true for fixed-length tuples", () => {
			// fixed-length tuples
			assertTrue<IsFixedLength<[number]>>();
			assertTrue<IsFixedLength<[number, number]>>();
			assertTrue<IsFixedLength<[1, 2, "3"]>>();
			assertFalse<IsVariableLength<[number]>>();
			assertFalse<IsVariableLength<[number, number]>>();
			assertFalse<IsVariableLength<[1, 2, "3"]>>();
		});

		it("should return false for arrays and open-ended tuples", () => {
			// array
			assertFalse<IsFixedLength<number[]>>();
			assertFalse<IsFixedLength<[...number[]]>>();
			assertFalse<IsFixedLength<[1, ...string[]]>>();
			assertTrue<IsVariableLength<number[]>>();
			assertTrue<IsVariableLength<[...number[]]>>();
			assertTrue<IsVariableLength<[1, ...string[]]>>();
		});
	});

	describe("IsTuple<T[]> => ", () => {
		it("should return true for empty tuples", () => {
			assertTrue<IsTuple<[]>>();
		});

		it("should return true for fixed-length and open-ended tuples", () => {
			// fixed-length tuples
			assertTrue<IsTuple<[number]>>();
			assertTrue<IsTuple<[number, number]>>();
			// open-ended tuples
			assertTrue<IsTuple<[number, number, ...string[]]>>();
		});

		it("should return false for arrays", () => {
			assertFalse<IsTuple<number[]>>();
		});
	});

	describe("Omit<T, K> => ", () => {
		it("should work on empty objects", () => {
			assertTrue<Equals<Omit<{}, never>, {}>>();
			assertTrue<Equals<Omit<{}, "something">, {}>>();
			assertTrue<Equals<Omit<{}, "some" | "props">, {}>>();
		});

		it("should keep existing properties if they are not to be excluded", () => {
			assertTrue<Equals<Omit<{ a: number }, never>, { a: number }>>();
			assertTrue<Equals<Omit<{ a: number, b: string[] }, "something">, { a: number, b: string[] }>>();
			assertTrue<Equals<Omit<{ a: number, b: string[] }, "some" | "props">, { a: number, b: string[] }>>();
		});

		it("should keep remove the properties in the keys union from the type", () => {
			assertTrue<Equals<Omit<{ a: number }, "a">, {}>>();
			assertTrue<Equals<Omit<{ a: number, b: string[] }, "a">, { b: string[] }>>();
			assertTrue<Equals<Omit<{ a: number, b: string[] }, "a" | "b">, {}>>();
			assertTrue<Equals<Omit<{ a: number, b: string[], c: any }, "a" | "b">, { c: any }>>();
		});
	});

	describe("Optional<T, K> => ", () => {
		it("should work on empty objects", () => {
			assertTrue<Equals<Optional<{}, never>, {}>>();
			assertTrue<Equals<Optional<{}, "something">, {}>>();
			assertTrue<Equals<Optional<{}, "some" | "props">, {}>>();
		});

		it("should return an empty objects if no properties from K exist on T", () => {
			assertTrue<Equals<Optional<{ a: number }, never>, {}>>();
			assertTrue<Equals<Optional<{ a: number, b: string[] }, "something">, {}>>();
			assertTrue<Equals<Optional<{ a: number, b: string[] }, "some" | "props">, {}>>();
		});

		it("should take all properties in K from T and make them optional", () => {
			assertTrue<Equals<Optional<{ a: number }, "a">, { a?: number }>>();
			assertTrue<Equals<Optional<{ a: number, b: string[] }, "a">, { a?: number }>>();
			assertTrue<Equals<Optional<{ a: number, b: string[] }, "a" | "b">, { a?: number, b?: string[] }>>();
		});

	});

	describe("SemiPartial<T, K> => ", () => {
		it("should work on empty objects", () => {
			assertTrue<Equals<SemiPartial<{}, never>, {}>>();
		});

		it("should take all properties in K from T and make them optional WHILE keeping the rest", () => {
			assertTrue<Equals<SemiPartial<{ a: number }, "a">, { a?: number }>>();
			assertTrue<Equals<SemiPartial<{ a: number, b: string[] }, "a">, { a?: number, b: string[] }>>();
			assertTrue<Equals<SemiPartial<{ a: number, b: string[] }, "a" | "b">, { a?: number, b?: string[] }>>();
		});

	});

	describe("KeyValuePairsOf<T> => ", () => {
		it("should return never for empty objects", () => {
			assertTrue<Equals<KeyValuePairsOf<{}>, never>>();
		});

		it("should create a union with all {key, value} pairs", () => {
			assertTrue<Equals<KeyValuePairsOf<{ a: 1 }>, { key: "a", value: 1 }>>();
			assertTrue<Equals<KeyValuePairsOf<{ a: 1, b: 2 }>, { key: "a", value: 1 } | { key: "b", value: 2 }>>();
		});
	});

	describe("Simplify<T> => ", () => {
		it("should leave empty objects unchanged", () => {
			assertTrue<Equals<Simplify<{}>, {}>>();
		});

		it("should return a simplified representation of object types", () => {
			assertTrue<Equals<Simplify<{ b: string } & { a?: boolean }>, { b: string, a?: boolean }>>();
			assertTrue<Equals<Simplify<Pick<{ a: number, b: string }, "b"> & { a?: boolean }>, { b: string, a?: boolean }>>();
			assertTrue<Equals<Simplify<{ a: "a" } | { a: "b" }>, { a: "a" | "b" }>>();
		});
	});

	describe("Overwrite<T, U> => ", () => {
		it("should leave empty objects unchanged", () => {
			assertTrue<Equals<Overwrite<{}, {}>, {}>>();
		});

		it("when one argument is an empty object, return the other one", () => {
			assertTrue<Equals<Overwrite<{}, { a: number }>, { a: number }>>();
			assertTrue<Equals<Overwrite<{ a: string }, {}>, { a: string }>>();
		});

		it("should return the properties from T which are not in U plus the properties from U", () => {
			assertTrue<Equals<Overwrite<{ b: string }, { a?: boolean }>, { b: string, a?: boolean }>>();
			assertTrue<Equals<Overwrite<{ a: number, b: string }, { a?: boolean }>, { b: string, a?: boolean }>>();
			assertTrue<Equals<Overwrite<{ a: "a" }, { a: "b" }>, { a: "b" }>>();
		});
	});

	describe("Head<T[]> => ", () => {
		it("should return never for empty arrays/tuples", () => {
			assertTrue<Equals<Head<[]>, never>>();
		});

		it("should return the first item's type", () => {
			assertTrue<Equals<Head<[1]>, 1>>();
			assertTrue<Equals<Head<[1, 2]>, 1>>();
			assertTrue<Equals<Head<[3, 2, number]>, 3>>();
		});
	});

	describe("Tail<T[]> => ", () => {
		it("should return an empty tuple for tuples/arrays with length less than 2", () => {
			assertTrue<Equals<Tail<[]>, []>>();
			assertTrue<Equals<Tail<[1]>, []>>();
			assertTrue<Equals<Tail<[number]>, []>>();
		});

		it("should return a tuple of all but the first item's type", () => {
			assertTrue<Equals<Tail<[1, 2]>, [2]>>();
			assertTrue<Equals<Tail<[3, 2, number]>, [2, number]>>();
			// open-ended tuples
			assertTrue<Equals<Tail<[number, ...string[]]>, string[]>>();
			assertTrue<Equals<Tail<[number, boolean?, ...string[]]>, [boolean?, ...string[]]>>();
			// For array types, tail should be an identity operation
			assertTrue<Equals<Tail<[...string[]]>, string[]>>();
			assertTrue<Equals<Tail<string[]>, string[]>>();
		});
	});

	describe("Lead<T[]> => ", () => {
		it("should return an empty tuple for tuples/arrays with length less than 2", () => {
			assertTrue<Equals<Lead<[]>, []>>();
			assertTrue<Equals<Lead<[1]>, []>>();
			assertTrue<Equals<Lead<[number]>, []>>();
		});

		it("should return a tuple of all but the last item's type", () => {
			assertTrue<Equals<Lead<[1, 2]>, [1]>>();
			assertTrue<Equals<Lead<[boolean, 2, number]>, [boolean, 2]>>();
			// For open-ended tuples and array types, Lead should be an identity operation
			assertTrue<Equals<Lead<[number, ...string[]]>, [number, ...string[]]>>();
			assertTrue<Equals<Lead<[number, boolean?, ...string[]]>, [number, boolean?, ...string[]]>>();
			assertTrue<Equals<Lead<[...string[]]>, string[]>>();
			assertTrue<Equals<Lead<string[]>, string[]>>();
		});
	});

	describe("Unshift<T[], I> => ", () => {
		it("should prepend the given element to the tuple/array", () => {
			assertTrue<Equals<Unshift<[], 1>, [1]>>();
			assertTrue<Equals<Unshift<[1], 2>, [2, 1]>>();
			assertTrue<Equals<Unshift<[number, string], boolean>, [boolean, number, string]>>();
		});

	});

	describe("ArgumentAt<F, N> => ", () => {
		type F1 = () => void;
		type F2 = (a1: number) => void;
		type F3 = (a1: string, a2?: any) => string;
		type F4 = (a1: boolean, ...rest: string[]) => any;
		type F5 = (a1: number[]) => void;

		it("should return the Nth argument of F", () => {
			assertTrue<Equals<ArgumentAt<F2, 0>, number>>();
			assertTrue<Equals<ArgumentAt<F3, 0>, string>>();
			assertTrue<Equals<ArgumentAt<F3, 1>, any>>();
			assertTrue<Equals<ArgumentAt<F4, 0>, boolean>>();
			assertTrue<Equals<ArgumentAt<F4, 1>, string>>();
			assertTrue<Equals<ArgumentAt<F5, 0>, number[]>>();
		});

		it("should return never when a higher index than the length is requested", () => {
			assertTrue<Equals<ArgumentAt<F1, 0>, never>>();
			assertTrue<Equals<ArgumentAt<F1, 1>, never>>();
			assertTrue<Equals<ArgumentAt<F2, 1>, never>>();
			assertTrue<Equals<ArgumentAt<F3, 2>, never>>();
			assertTrue<Equals<ArgumentAt<F5, 1>, never>>();
		});

	});

	describe("Last<T[]> => ", () => {
		it("should return never for empty tuples", () => {
			assertTrue<Equals<Last<[]>, never>>();
		});

		it("should return the last item's type", () => {
			assertTrue<Equals<Last<[1, 2]>, 2>>();
			assertTrue<Equals<Last<[2, 3, number]>, number>>();
			// arrays
			assertTrue<Equals<Last<string[]>, string>>();
			// Optional entries
			assertTrue<Equals<Last<[1, 2?]>, 2 | undefined>>();
		});

		// This does not currently work
		it.skip("should work for open-ended tuples", () => {
			// assertTrue<Equals<Last<[number, ...string[]]>, number | string>>();
			// assertTrue<Equals<Last<[number, boolean, ...string[]]>, boolean | string>>();
			// assertTrue<Equals<Last<[...string[]]>, string>>();
		});
	});

	describe("LastArg<T> => ", () => {
		it("should correctly the last argument of a method", () => {
			type F1 = () => void;
			type P1 = LastArgument<F1>;

			type F2 = (a1: number) => void;
			type P2 = LastArgument<F2>;

			type F3 = (a1: number, a2: string) => void;
			type P3 = LastArgument<F3>;

			type F4 = (a1: number, a2: string, a3: any, a4: unknown, a5: () => void) => void;
			type P4 = LastArgument<F4>;

			assertTrue<Equals<P1, never>>();
			assertTrue<Equals<P2, number>>();
			assertTrue<Equals<P3, string>>();
			assertTrue<Equals<P4, () => void>>();

		});
	});

	describe("CallbackAPIReturnType<T> => ", () => {
		it("should correctly infer the return type of the callback argument", () => {

			type F1 = (cb: (err?: Error) => void) => void;
			type P1 = CallbackAPIReturnType<F1>;

			type F2 = (cb: (err: Error, ret: boolean) => void) => void;
			type P2 = CallbackAPIReturnType<F2>;

			type F3 = (arg1: string, cb: (err: Error, ret: number) => void) => void;
			type P3 = CallbackAPIReturnType<F3>;

			assertTrue<Equals<P1, void>>();
			assertTrue<Equals<P2, boolean>>();
			assertTrue<Equals<P3, number>>();
		});
	});

	describe("Promisify<T> => ", () => {
		it("should correctly infer the return type", () => {
			type F1 = (cb: (err: Error) => void) => void;
			type P1 = Promisify<F1>;

			type F2 = (cb: (err: Error, ret: boolean) => void) => void;
			type P2 = Promisify<F2>;

			type F3 = (one: string, cb: (err: Error, ret: number) => void) => void;
			type P3 = Promisify<F3>;

			assertTrue<Equals<ReturnType<P1>, Promise<void>>>();
			assertTrue<Equals<ReturnType<P2>, Promise<boolean>>>();
			assertTrue<Equals<ReturnType<P3>, Promise<number>>>();
		});

		it("should correctly infer the argument types", () => {
			type F1 = (cb: (err: Error) => void) => void;
			type P1 = Promisify<F1>;

			type F2 = (cb: (err: Error, ret: boolean) => void) => void;
			type P2 = Promisify<F2>;

			type F3 = (arg1: string, cb: (err: Error, ret: number) => void) => void;
			type P3 = Promisify<F3>;

			type F4 = (arg1: string, arg2: () => void, cb: (err: Error, ret: number) => void) => void;
			type P4 = Promisify<F4>;

			assertTrue<Equals<Parameters<P1>, []>>();
			assertTrue<Equals<Parameters<P2>, []>>();
			assertTrue<Equals<Parameters<P3>, [string]>>();
			assertTrue<Equals<Parameters<P4>, [string, () => void]>>();
		});

		it("test cases from https://github.com/microsoft/TypeScript/issues/41563", () => {

			type F1 = (arg: string, cb: (err: unknown, result: number) => void) => void;
			type P1 = Promisify<F1>;
			type E1 = (arg: string) => Promise<number>;
			assertTrue<Equals<P1, E1>>();

			type F2 = (arg: string, cb: (err: any, result: number) => void) => void;
			type P2 = Promisify<F2>;
			type E2 = (arg: string) => Promise<number>;
			assertTrue<Equals<P2, E2>>();

			type F3 = (cb: (err: Error | null, result: number) => void) => void;
			type P3 = Promisify<F3>;
			type E3 = () => Promise<number>;
			assertTrue<Equals<P3, E3>>();

			type F4 = (cb: (err: Error | null) => void) => void;
			type P4 = Promisify<F4>;
			type E4 = () => Promise<void>;
			assertTrue<Equals<P4, E4>>();

			type F5 = (arg: string, cb: (err: Error | null, result: number) => void) => void;
			type P5 = Promisify<F5>;
			type E5 = (arg: string) => Promise<number>;
			assertTrue<Equals<P5, E5>>();

			type F6 = (arg: string, cb: (err: Error | null) => void) => void;
			type P6 = Promisify<F6>;
			type E6 = (arg: string) => Promise<void>;
			assertTrue<Equals<P6, E6>>();

			type F7 = (cb: (err?: Error | null) => void) => void;
			type P7 = Promisify<F7>;
			type E7 = () => Promise<void>;
			assertTrue<Equals<P7, E7>>();
		});
	});

	describe("NoInfer<T> => ", () => {
		it("should prevent inferring generic type arguments from the marked parameter", () => {
			const testNoInferArg2 = <T>(arg1: T, arg2: NoInfer<T>) => arg2 as T;

			// @ts-expect-error: this is an intentional error
			const test1 = testNoInferArg2({ a: 1 }, { b: 2 });
			// @ts-expect-error: this is an intentional error
			const test2 = testNoInferArg2({ a: 1 }, { a: 1, b: 2 });

			class Foo { private a; }
			class Bar extends Foo { private b; }

			const testNotInferred = testNoInferArg2(new Foo(), new Bar());

			type Tests = [
				Not<Equals<typeof test1, { a: 1 }>>,
				Not<Equals<typeof test1, { b: 2 }>>,

				Not<Equals<typeof test2, { a: 1 }>>,
				Not<Equals<typeof test2, { a: 1, b: 2 }>>,

				Equals<typeof testNotInferred, Foo>,
			];

			const success: Every<Tests, true> = true;
		});
	});

	describe("TupleOf<T> => ", () => {
		it("should create a fixed-length tuple of the given type and length", () => {
			assertTrue<Equals<TupleOf<any, 0>, []>>();
			assertTrue<Equals<TupleOf<string, 2>, [string, string]>>();
			assertTrue<Equals<
				TupleOf<number | string, 3 | 4>,
				[number | string, number | string, number | string]
				 | [number | string, number | string, number | string, number | string]
			>>();
		});

		it("should create an array if the length is unknown", () => {
			assertTrue<Equals<TupleOf<boolean, number>, boolean[]>>();
		});
	});

	describe("Range<N> =>", () => {
		it(`should return a union of numeric strings from "0" to "N-1"`, () => {
			assertTrue<Equals<Range<0>, never>>();
			assertTrue<Equals<Range<2>, "0" | "1">>();
		})
	})

	describe("RangeFrom<N, M> =>", () => {
		it(`should return a union of numeric strings from "N" to "M-1"`, () => {
			assertTrue<Equals<RangeFrom<0, 0>, never>>();
			assertTrue<Equals<RangeFrom<2000, 2003>, "2000" | "2001" | "2002">>();
		})
	})

	describe("Comparisons =>", () => {
		it(`should compare the given numeric types and return true/false`, () => {
			type Tests = [
				IsGreaterThan<200, 199>,
				Not<IsGreaterThan<200,200>>,
				IsGreaterThanOrEqual<99, 99>,
				IsGreaterThanOrEqual<99, 98>,
				IsLessThan<20, 22>,
				Not<IsLessThan<22,22>>,
				IsLessThanOrEqual<30, 32>,
				IsLessThanOrEqual<32, 32>,
			];
			assertTrue<Every<Tests, true>>();
		})
	})

});

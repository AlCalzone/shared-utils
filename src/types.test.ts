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

import { Equals, Omit } from "./types";

type IsNever<T, R> = [T] extends [R] ? true : false;
type OneIsNever = IsNever<1, [1]>;

// These tests all succeed during runtime
// a failed test can only occur due to compile errors
describe.only("types => ", () => {

	describe("Equals => ", () => {
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

			type AllTrue =
				Tests extends true[] ? true : false;

			const success: AllTrue = true;
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
				Equals<{a: number}, object>,
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

			type AllFalse =
				Tests extends false[] ? true : false;

			const success: AllFalse = true;
		});
	});

	describe.skip("Omit => ", () => {

		it("should work on empty types", () => {
		});

	});

});

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

import { Omit, Equals } from "./types";

type IsNever<T, R> = [T] extends [R] ? true : false;
type OneIsNever = IsNever<1, [1]>;

// These tests all succeed during runtime
// a failed test can only occur due to compile errors
describe.only("types => ", () => {

	describe("Equals => ", () => {
		it("should return true for identical types", () => {
			type Tests = [
				Equals<1, 1>,
				Equals<number, number>,
				Equals<"", "">,
				Equals<"1", "1">,
				Equals<string, string>,
				Equals<true, true>,
				Equals<false, false>,
				Equals<boolean, boolean>
			];

			type AllTrue =
				Tests extends true[] ? true : false;

			const success: AllTrue = true;
		});

		it("should return false for non-identical types", () => {
			type Tests = [
				Equals<1, 0>,
				Equals<number, 1>,
				Equals<"1", "">,
				Equals<"1", string>,
				Equals<1, string>,
				Equals<true, boolean>,
				Equals<true, false>,
				Equals<boolean, false>
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

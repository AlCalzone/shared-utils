import { expect, describe, it } from "vitest";

import { assertNever } from ".";
declare let never: never;

describe("helpers => ", () => {
	describe("assertNever() => ", () => {
		it("throws when called", () => {
			expect(assertNever).to.throw("Unexpected");
		});

		it("contains the unexpected value in its error message", () => {
			expect(() => assertNever("foobar" as never)).to.throw("foobar");
		});

		it("has the correct types", () => {
			function testNever(foo: 1 | 2) {
				if (foo === 1 || foo === 2) {
					// nothing to do here
				} else {
					never = assertNever(foo);
				}
			}
			testNever(1);
			testNever(2);
		});
	});
});

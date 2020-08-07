// tslint:disable:no-console
// tslint:disable:no-unused-expression
// tslint:disable:variable-name

import { assert, expect, should, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { SinonFakeTimers, spy, stub, useFakeTimers } from "sinon";
import * as sinonChai from "sinon-chai";

// enable the should interface with sinon
should();
// improve stubs for testing
use(sinonChai);
use(chaiAsPromised);

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
			function testNever(foo: 1|2) {
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

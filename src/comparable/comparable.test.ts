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

import { compareNumberOrString, isComparable } from "./comparable";

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
});

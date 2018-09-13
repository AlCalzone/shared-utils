import { assert, expect } from "chai";
import { isArray, isObject } from ".";
// tslint:disable:no-unused-expression

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
			[
				null, undefined,
				1, 2, 3, "1", "2", "3",
				true, false,
			].forEach(val => isObject(val).should.be.false);
		});
	});

	describe("isArray() => ", () => {
		it("should return true for array literals", () => {
			isArray([]).should.be.true;
			isArray([1, 2, 3]).should.be.true;
		});

		it("should return true for Array instances", () => {
			isArray(new Array()).should.be.true;
		});

		it("should return false for everything else", () => {
			[
				{}, new Object(), new Buffer(0),
				null, undefined,
				1, 2, 3, "1", "2", "3",
				true, false,
			].forEach(val => isArray(val).should.be.false);
		});
	});
});

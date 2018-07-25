// tslint:disable:no-console
// tslint:disable:no-unused-expression
// tslint:disable:variable-name

import { assert, expect, should, use } from "chai";
import { spy, stub } from "sinon";
import * as sinonChai from "sinon-chai";

// enable the should interface with sinon
should();
// improve stubs for testing
use(sinonChai);

import { composeObject, entries, extend, filter, KeyValuePair, values } from "./objects";

describe("objects => ", () => {

	describe("entries() => ", () => {

		it("should return an array", () => {
			expect(Array.isArray(entries({}))).to.be.true;
		});

		it("should work for empty objects", () => {
			expect(entries({})).to.deep.equal([]);
		});

		it("the returned array should contain one entry for each key in the object", () => {
			let ret = entries({ a: "b", c: "d" });
			ret.length.should.equal(2);

			ret = entries({ a: "b", c: "d", e: "f", g: "h" });
			ret.length.should.equal(4);
		});

		it("each returned array item should contain the property key and its value", () => {
			const obj = { a: "b", c: 0xd };
			const ret = entries(obj);
			ret.every(item => Array.isArray(item)).should.equal(true, "an item was not an Array");
			ret.every(item => item.length === 2).should.equal(true, "an item was not a 2-item-tuple");
			ret.every(item => typeof item[0] === "string").should.equal(true, "an items' key was not a string");

			ret.every(([key, value]) => obj[key] === value).should.equal(true, "a property value did not match");
		});

	});

	describe("values() => ", () => {

		it("should return an array", () => {
			expect(Array.isArray(values({}))).to.be.true;
		});

		it("should work for empty objects", () => {
			expect(values({})).to.deep.equal([]);
		});

		it("the returned array should contain one entry for each key in the object", () => {
			let ret = values({ a: "b", c: "d" });
			ret.length.should.equal(2);

			ret = values({ a: "b", c: "d", e: "f", g: "h" });
			ret.length.should.equal(4);
		});

		it("the returned array should contain the property values of the object", () => {
			let ret = values({ a: "b", c: "d" });
			ret.should.deep.equal(["b", "d"]);

			ret = values({ a: "b", c: "d", e: "f", g: "h" });
			ret.should.deep.equal(["b", "d", "f", "h"]);
		});
	});

	describe("filter() => ", () => {
		it("should return an object", () => {
			const ret = filter({}, null!);
			ret.should.be.an("object");
		});

		it("that is a subset of the passed object", () => {
			const original = {
				a: "1",
				b: 2,
				c: "3",
				d: true,
			};

			let ret = filter(original, (item) => item === 2);
			original.should.deep.include(ret);

			ret = filter(original, (item) => item === "3");
			original.should.deep.include(ret);

			ret = filter(original, (item) => item === true);
			original.should.deep.include(ret);
		});

		it("and only contains values that match the predicate", () => {
			const original = {
				a: "1",
				b: 2,
				c: "3",
				d: true,
				e: true,
			};

			let ret = filter(original, (item) => item === 2);
			ret.should.deep.equal({ b: 2 });

			ret = filter(original, (item, key) => key === "c");
			ret.should.deep.equal({ c: "3" });

			ret = filter(original, (item) => item === true);
			ret.should.deep.equal({ d: true, e: true });
		});

		it("should work correctly with an impossible filter", () => {
			expect(filter({a: 1, b: 2, c: 3}, () => false)).to.deep.equal({ });
		});

		it("should work for empty objects", () => {
			expect(filter({}, () => true)).to.deep.equal({});
		});
	});

	describe("composeObject() => ", () => {
		it("should return an object", () => {
			expect(composeObject([])).to.be.an("object");
		});
		it("which consists of the property keys and values in the given key value pairs", () => {
			const ret = composeObject([
				["a", 0xb],
				["c", "d"],
			] as KeyValuePair<string | number>[]);
			ret.should.deep.equal({
				a: 0xb,
				c: "d",
			});
		});
		it("should overwrite duplicates", () => {
			const ret = composeObject([
				["a", 0xb],
				["c", "d"],
				["e", "E"],
				["a", "A"],
			] as KeyValuePair<string | number>[]);
			ret.should.deep.equal({
				c: "d",
				e: "E",
				a: "A",
			});
		});
		it("should work for empty arrays", () => {
			expect(composeObject([])).to.deep.equal({});
		});
	});

	describe("extend() => ", () => {
		it("should return an object", () => {
			extend({}, {}).should.be.an("object");
		});
		it("even if the passed target was null or undefined", () => {
			extend(undefined, {}).should.be.an("object");
			extend(null, {}).should.be.an("object");
		});
		it("should return the modified target object", () => {
			const target = { a: "b", c: 0xd };
			const source = { e: "f" };
			const ret = extend(target, source);
			ret.should.deep.equal(target);
		});
		it("which contains all properties of the target and source object", () => {
			const target = { a: "b", c: 0xd };
			const source = { e: "f" };
			const ret = extend(target, source);
			ret.should.deep.equal({
				a: "b",
				c: 0xd,
				e: "f",
			});
		});
		it("if a property value is an object, deep merge it", () => {
			const target = { a: "b", c: { d: 0xd } };
			const source = { c: { e: "e" } };
			const ret = extend(target, source);
			ret.should.deep.equal({
				a: "b",
				c: {
					d: 0xd,
					e: "e",
				},
			});
		});

		it("if multiple source objects are given, merge them all", () => {
			const target = { a: "b" };
			const source1 = { c: 0xd };
			const source2 = { e: "f" };
			const ret = extend(target, source1, source2);
			ret.should.deep.equal({
				a: "b",
				c: 0xd,
				e: "f",
			});
		});

		it("multiple sources should be merged in order", () => {
			const target = { a: "b" };
			const source1 = { c: 0xd };
			const source2 = { c: "f" };

			let ret = extend({}, target, source1, source2);
			ret.should.deep.equal({
				a: "b",
				c: "f",
			});

			ret = extend({}, target, source2, source1);
			ret.should.deep.equal({
				a: "b",
				c: 0xd,
			});
		});

		it("should correctly work with null as a target", () => {
			extend(null, {a: "a"}).should.deep.equal({a: "a"});
		});
		it("should correctly work with empty objects", () => {
			extend({}, {}).should.deep.equal({});
		});

		// Regression tests
		it("should be able to overwrite a primitive with an object", () => {
			const target = {a: 1, d: "e"};
			const source = {a: {b: "c"}};
			extend(target, source).should.deep.equal({
				a: {b: "c"},
				d: "e",
			});
		});
		it("should be able to overwrite an object with a primitive", () => {
			const target = {a: {b: "c"}, d: "e"};
			const source = {a: 1};
			extend(target, source).should.deep.equal({
				a: 1,
				d: "e",
			});
		});
	});

});

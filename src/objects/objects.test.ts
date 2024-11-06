import { expect, describe, it } from "vitest";
import { extend, filter } from ".";

describe("objects => ", () => {
	describe("filter() => ", () => {
		it("should return an object", () => {
			const ret = filter({}, null!);
			expect(ret).to.be.an("object");
		});

		it("that is a subset of the passed object", () => {
			const original = {
				a: "1",
				b: 2,
				c: "3",
				d: true,
			};

			let ret = filter(original, (item) => item === 2);
			expect(original).to.deep.include(ret);

			ret = filter(original, (item) => item === "3");
			expect(original).to.deep.include(ret);

			ret = filter(original, (item) => item === true);
			expect(original).to.deep.include(ret);
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
			expect(ret).to.deep.equal({ b: 2 });

			ret = filter(original, (item, key) => key === "c");
			expect(ret).to.deep.equal({ c: "3" });

			ret = filter(original, (item) => item === true);
			expect(ret).to.deep.equal({ d: true, e: true });
		});

		it("should work correctly with an impossible filter", () => {
			expect(filter({ a: 1, b: 2, c: 3 }, () => false)).to.deep.equal({});
		});

		it("should work for empty objects", () => {
			expect(filter({}, () => true)).to.deep.equal({});
		});
	});

	describe("extend() => ", () => {
		it("should return an object", () => {
			expect(extend({}, {})).to.be.an("object");
		});
		it("even if the passed target was null or undefined", () => {
			expect(extend(undefined, {})).to.be.an("object");
			expect(extend(null, {})).to.be.an("object");
		});
		it("should return the modified target object", () => {
			const target = { a: "b", c: 0xd };
			const source = { e: "f" };
			const ret = extend(target, source);
			expect(ret).to.deep.equal(target);
		});
		it("which contains all properties of the target and source object", () => {
			const target = { a: "b", c: 0xd };
			const source = { e: "f" };
			const ret = extend(target, source);
			expect(ret).to.deep.equal({
				a: "b",
				c: 0xd,
				e: "f",
			});
		});
		it("if a property value is an object, deep merge it", () => {
			const target = { a: "b", c: { d: 0xd } };
			const source = { c: { e: "e" } };
			const ret = extend(target, source);
			expect(ret).to.deep.equal({
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
			expect(ret).to.deep.equal({
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
			expect(ret).to.deep.equal({
				a: "b",
				c: "f",
			});

			ret = extend({}, target, source2, source1);
			expect(ret).to.deep.equal({
				a: "b",
				c: 0xd,
			});
		});

		it("should correctly work with null as a target", () => {
			expect(extend(null, { a: "a" })).to.deep.equal({ a: "a" });
		});
		it("should correctly work with empty objects", () => {
			expect(extend({}, {})).to.deep.equal({});
		});

		// Regression tests
		it("should be able to overwrite a primitive with an object", () => {
			const target = { a: 1, d: "e" };
			const source = { a: { b: "c" } };
			expect(extend(target, source)).to.deep.equal({
				a: { b: "c" },
				d: "e",
			});
		});
		it("should be able to overwrite an object with a primitive", () => {
			const target = { a: { b: "c" }, d: "e" };
			const source = { a: 1 };
			expect(extend(target, source)).to.deep.equal({
				a: 1,
				d: "e",
			});
		});

		it("should never keep a reference to the original object around", () => {
			const source = { a: { b: "c" } };
			const target1 = extend({}, source);
			const target2 = extend({}, source);
			// we perform a deep copy
			expect(target1).to.deep.equal(target2);
			// but don't copy source objects
			expect(target1).not.toBe(target2);
			expect(target1.a).not.toBe(target2.a);
		});

		it("should be able to handle a source property with value null", () => {
			const target = { a: { b: "c" } };
			const source = { a: null };
			expect(extend(target, source)).to.deep.equal({ a: null });
		});

		it("should be able to handle a target property with value null", () => {
			const source = { a: { b: "c" } };
			const target = { a: null };
			expect(extend(target, source)).to.deep.equal({ a: { b: "c" } });
		});

		it("should be able to handle a source property with value undefined", () => {
			const target = { a: { b: "c" } };
			const source = { a: undefined };
			expect(extend(target, source)).to.deep.equal({ a: undefined });
		});

		it("should be able to handle a target property with value undefined", () => {
			const source = { a: { b: "c" } };
			const target = { a: undefined };
			expect(extend(target, source)).to.deep.equal({ a: { b: "c" } });
		});
	});
});

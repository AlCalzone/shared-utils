// tslint:disable:no-unused-expression

import { expect, should, use } from "chai";
import { spy, stub } from "sinon";
should();

import { SortedList } from ".";

describe("sorted-list => ", () => {

	it("should contain all items passed to it in the constructor and no others", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		for (const item of containedItems) {
			list.contains(item).should.be.true;
		}

		const nonContainedItems = [6, 3, 7, 10, -1, 0];
		for (const item of nonContainedItems) {
			list.contains(item).should.be.false;
		}
	});

	it("should have the same length as the array passed in the constructor", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		list.length.should.equal(containedItems.length);
	});

	it("should be iterated in a sorted order", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const expected = [...containedItems].sort();
		const list = new SortedList(containedItems);
		let i = 0;
		for (const item of list) {
			expect(item).to.equal(expected[i]);
			i++;
		}
	});

	it("toArray should be sorted", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const expected = [...containedItems].sort();
		const list = new SortedList(containedItems);
		expect(list.toArray()).to.deep.equal(expected);
	});

	it("adding an item should update the length and put the item in its correct position", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		const expected = [...containedItems, 3].sort();
		list.add(3).should.equal(list.length);
		list.length.should.equal(expected.length);
		expect(list.toArray()).to.deep.equal(expected);
	});

	it("removing an item should update the length and remove the item from its correct position", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		const expected = [1, 5, 2, 9, 8].sort();
		list.remove(4).should.equal(list.length);
		list.length.should.equal(expected.length);
		expect(list.toArray()).to.deep.equal(expected);
	});

	it("shift() should remove the smallest item in the list and return it", () => {
		const containedItems = [2, -1, 5, 4, 9, 8];
		const list = new SortedList(containedItems);
		const expected = [2, 5, 4, 9, 8].sort();
		list.shift().should.equal(-1);
		list.length.should.equal(expected.length);
		expect(list.toArray()).to.deep.equal(expected);
	});

	it("shift() should return undefined for empty lists", () => {
		const list = new SortedList([]);
		expect(list.shift()).to.be.undefined;
	});

	it("peekStart() should return the smallest item in the list without removing it from the list", () => {
		const containedItems = [2, -1, 5, 4, 9, 8];
		const expected = [...containedItems].sort();
		const list = new SortedList(containedItems);
		list.peekStart().should.equal(-1);
		list.length.should.equal(expected.length);
		expect(list.toArray()).to.deep.equal(expected);
	});

	it("peekStart() should return undefined for empty lists", () => {
		const list = new SortedList([]);
		expect(list.peekStart()).to.be.undefined;
	});

	it("pop() should remove the largest item in the list and return it", () => {
		const containedItems = [2, -1, 5, 4, 9, 8];
		const list = new SortedList(containedItems);
		const expected = [2, -1, 5, 4, 8].sort();
		list.pop().should.equal(9);
		list.length.should.equal(expected.length);
		expect(list.toArray()).to.deep.equal(expected);
	});

	it("pop() should return undefined for empty lists", () => {
		const list = new SortedList([]);
		expect(list.pop()).to.be.undefined;
	});

	it("peekEnd() should return the smallest item in the list without removing it from the list", () => {
		const containedItems = [2, -1, 5, 4, 9, 8];
		const expected = [...containedItems].sort();
		const list = new SortedList(containedItems);
		list.peekEnd().should.equal(9);
		list.length.should.equal(expected.length);
		expect(list.toArray()).to.deep.equal(expected);
	});

	it("peekEnd() should return undefined for empty lists", () => {
		const list = new SortedList([]);
		expect(list.peekEnd()).to.be.undefined;
	});

	it("adding items to an empty list should work", () => {
		const list = new SortedList<number>();
		list.add(3).should.equal(1);
		list.length.should.equal(1);
		expect(list.toArray()).to.deep.equal([3]);
	});

	it("adding identical items should work", () => {
		const list = new SortedList<number>();
		list.add(1).should.equal(1);
		list.add(1).should.equal(2);
		list.add(1).should.equal(3);
		list.length.should.equal(3);
		expect(list.toArray()).to.deep.equal([1, 1, 1]);
	});

	it("replacing the first item should work", () => {
		const list = new SortedList<number>([1, 3, 2]);
		list.add(0).should.equal(4);
		expect(list.toArray()).to.deep.equal([0, 1, 2, 3]);
	});

	it("removing the last item should work", () => {
		const list = new SortedList<number>([3]);
		list.remove(3).should.equal(0);
		list.length.should.equal(0);
		expect(list.toArray()).to.deep.equal([]);
	});

	it("calling remove on an empty list should work", () => {
		const list = new SortedList<number>();
		list.remove(3).should.equal(0);
		list.length.should.equal(0);
		expect(list.toArray()).to.deep.equal([]);
	});

	it("calling remove with a non-existing item should do nothing", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		const expected = [...containedItems].sort();
		list.remove(-1).should.equal(list.length);
		list.length.should.equal(expected.length);
		expect(list.toArray()).to.deep.equal(expected);
	});

	it("clearing the list should remove all items and reset the length", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		list.clear();
		list.length.should.equal(0);
		expect(list.toArray()).to.deep.equal([]);
	});

	it("should throw when not using strings or numbers without a custom comparer", () => {
		expect(() => new SortedList([{}, {}])).to.throw("comparer");
	});

	it("should compare custom items using the custom comparer", () => {
		const comparer = stub().returns(0);
		const list = new SortedList([{}, {}], comparer);
		comparer.should.have.been.called;
	});

	it("should compare custom items using their compareTo method if it exists", () => {
		const largeObj = {compareTo: stub().returns(1)};
		const smallObj = {compareTo: stub().returns(-1)};
		const list = new SortedList([largeObj, smallObj]);
		expect(largeObj.compareTo.called || smallObj.compareTo.called).to.be.true;
		expect(list.toArray()).to.deep.equal([smallObj, largeObj]);
	});

	it("when the compareTo method throws an error it should be passed through", () => {
		const faultyComparer = stub().throws(new Error("bogus error"));
		const obj1 = {compareTo: faultyComparer};
		const obj2 = {compareTo: faultyComparer};
		const list = new SortedList();
		expect(() => list.add(obj1, obj2)).to.throw("bogus");
	});

	it("should complain if only one item has a compareTo method", () => {
		const largeObj = {compareTo: stub().returns(1)};
		const smallObj = {};
		expect(() => new SortedList([largeObj, smallObj])).to.throw("comparer");
	});

	it("find() should return the first item matching the given predicate", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		list.find(item => item > 3).should.equal(4);
	});

	it("get() should return the sorted element at the given index", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		const expected = [...containedItems].sort();
		for (let i = 0; i < expected.length; i++) {
			list.get(i).should.equal(expected[i]);
		}
		expect(list.get(expected.length)).to.be.undefined;
	});

	it("calling get() with an invalid index should throw", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		const invalidIndizes = [-1, 0.5, Math.PI, Number.POSITIVE_INFINITY, Number.NaN];
		for (const index of invalidIndizes) {
			expect(() => list.get(index)).to.throw("valid");
		}
	});

	it("alternatively, the elements should be accessible using the index notation", () => {
		const containedItems = [1, 5, 2, 4, 9, 8];
		const list = new SortedList(containedItems);
		const expected = [...containedItems].sort();
		for (let i = 0; i < expected.length; i++) {
			list[i].should.equal(expected[i]);
		}
		expect(list[list.length]).to.be.undefined;
	});

});

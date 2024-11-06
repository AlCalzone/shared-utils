import { expect, describe, it } from "vitest";
import { distinct } from ".";

describe("distinct => ", () => {
	it("should return only unique values", () => {
		expect(distinct([1, 2, 4, 2, 3, 1, 4])).to.deep.equal([1, 2, 4, 3]);
		expect(distinct(["", "a", ""])).to.deep.equal(["", "a"]);
		expect(distinct([])).to.deep.equal([]);
	});
});

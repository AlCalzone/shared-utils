// tslint:disable:no-console
// tslint:disable:no-unused-expression
// tslint:disable:variable-name

import { assert, expect, should, use } from "chai";
import { SinonFakeTimers, spy, stub, useFakeTimers } from "sinon";
import * as sinonChai from "sinon-chai";

// enable the should interface with sinon
should();
// improve stubs for testing
use(sinonChai);

import { distinct } from ".";

describe("distinct => ", () => {
	it("should return only unique values", () => {
		distinct([1, 2, 4, 2, 3, 1, 4]).should.deep.equal([1, 2, 4, 3]);
		distinct(["", "a", ""]).should.deep.equal(["", "a"]);
		distinct([]).should.deep.equal([]);
	});
});

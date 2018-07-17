"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests if a given objects satisfies the Comparable<T> interface
 * @param obj The object to test
 */
function isComparable(obj) {
    return obj != null
        && typeof obj.compareTo === "function";
}
exports.isComparable = isComparable;
/**
 * Compares two numbers or strings. Returns 1 when the 2nd one is larger, 0 when both are equal or -1 when the 2nd one is smaller
 */
function compareNumberOrString(a, b) {
    return b > a ? 1
        : b === a ? 0
            : -1;
}
exports.compareNumberOrString = compareNumberOrString;

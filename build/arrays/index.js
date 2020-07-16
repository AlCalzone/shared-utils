"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Reduces an array to only unique values
 */
function distinct(arr) {
    // This is stupidly simple but seems to be one of the fastest methods to do this
    return [...new Set(arr)];
}
exports.distinct = distinct;
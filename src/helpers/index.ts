/** @module helpers */

/**
 * Asserts that all possible cases of a value have been checked
 * @param value The value to check for exhaustiveness
 */
export function assertNever(value: never): never {
	throw new Error(`Unexpected value observed: ${value}`);
}
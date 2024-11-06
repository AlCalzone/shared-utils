export type CompareResult = -1 | 0 | 1;
export type Comparer<T> = (a: T, b: T) => CompareResult;
export interface Comparable<T> {
	compareTo(other: T): CompareResult;
}

/**
 * Tests if a given objects satisfies the Comparable<T> interface
 * @param obj The object to test
 */
export function isComparable<T>(obj: T | Comparable<T>): obj is Comparable<T> {
	return (
		obj != null && typeof (obj as Comparable<T>).compareTo === "function"
	);
}

/**
 * Compares two numbers or strings. Returns 1 when the 2nd one is larger, 0 when both are equal or -1 when the 2nd one is smaller
 */
export function compareNumberOrString<T extends number | string>(
	a: T,
	b: T,
): CompareResult {
	return b > a ? 1 : b === a ? 0 : -1;
}

/**
 * The default comparer method to handle string, numbers and Comparable<T>.
 * @param a The first value to compare
 * @param b The second value to compare
 */
export function defaultComparer<T>(a: T, b: T): CompareResult {
	if (
		typeof a === typeof b &&
		(typeof a === "number" || typeof a === "string")
	) {
		return compareNumberOrString(a, b as typeof a);
	} else if (isComparable(a) && isComparable(b)) {
		return b.compareTo(a);
	}
	throw new Error(`cannot compare ${typeof a} with ${typeof b}`);
}

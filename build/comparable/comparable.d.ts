export declare type CompareResult = -1 | 0 | 1;
export declare type Comparer<T> = (a: T, b: T) => CompareResult;
export interface Comparable<T> {
    compareTo(other: T): CompareResult;
}
/**
 * Tests if a given objects satisfies the Comparable<T> interface
 * @param obj The object to test
 */
export declare function isComparable<T>(obj: T | Comparable<T>): obj is Comparable<T>;
/**
 * Compares two numbers or strings. Returns 1 when the 2nd one is larger, 0 when both are equal or -1 when the 2nd one is smaller
 */
export declare function compareNumberOrString<T extends number | string>(a: T, b: T): CompareResult;

/**
 * Tests whether the given variable is a real object and not an Array
 * @param it The variable to test
 */
export declare function isObject<T>(it: T): it is T & Record<string, unknown>;
/**
 * Tests whether the given variable is really an Array
 * @param it The variable to test
 */
export declare function isArray<T>(it: T): it is T & unknown[];

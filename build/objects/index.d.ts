export declare type Predicate<T> = (value: T, key: string) => boolean;
export declare type KeyValuePair<T> = [string, T];
/** Provides a polyfill for Object.entries */
export declare function entries<T = any>(obj: Record<string, T>): KeyValuePair<T>[];
/** Provides a polyfill for Object.values */
export declare function values<T = any>(obj: Record<string, T>): T[];
/**
 * Returns a subset of an object, whose properties match the given predicate
 * @param obj The object whose properties should be filtered
 * @param predicate A predicate function which is applied to the object's properties
 */
export declare function filter<T = any>(obj: Record<string, T>, predicate: Predicate<T>): Record<string, T>;
/**
 * Combines multiple key value pairs into an object
 * @param properties The key value pairs to combine into an object
 */
export declare function composeObject<T = any>(properties: KeyValuePair<T>[]): Record<string, any>;
/**
 * Deep merges multiple objects onto the target object.
 * This modifies the target object, so pass undefined or {}
 * to create a new object.
 */
export declare function extend(target: Record<string, any> | undefined | null, ...sources: Record<string, any>[]): Record<string, any>;

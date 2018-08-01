// shameless copy from https://github.com/Microsoft/TypeScript/issues/25760#issuecomment-406158222

/**
 * Tests if two types are equal
 */
export type Equals<T, S> =
	[T] extends [S] ? (
		[S] extends [T] ? true : false
	) : false
;

/**
 * Excludes the properties K from type T
 */
export type Omit<T, K> = { [P in Exclude<keyof T, K>]: T[P] };

/**
 * Builds a subset of type T with the properties K that are all optional
 */
export type Optional<T, K> = { [P in Extract<keyof T, K>]+?: T[P] };

/**
 * Makes the properties K in type T optional
 */
export type SemiPartial<T, K extends keyof T> = T extends never ? never : Omit<T, K> & Optional<T, K>;

/**
 * Extracts a union of possible key-value pairs from type T
 * @returns A union of `{key, value}` objects where `key` can take the values of `keyof T` and `value` the corresponding property types.
 */
export type KeyValuePairsOf<
	T extends Record<string, any>,
	U = {[K in keyof T]: {key: K, value: T[K] }}
> = U[keyof U];

/**
 * Returns the first item in a tuple
 */
export type Head<T extends any[]> =
	T extends [infer H, ...any[]] ? H : never;

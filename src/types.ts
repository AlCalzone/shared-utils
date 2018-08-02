// shameless copy from https://github.com/Microsoft/TypeScript/issues/25760#issuecomment-406158222

/**
 * Negates a boolean
 */
export type Not<T extends boolean> = T extends true ? false : true;

/**
 * Combines two booleans using logical AND
 */
export type And<T1 extends boolean, T2 extends boolean> =
	// if one of the arguments is exactly false, return false
	T1 extends false ? false :
	T2 extends false ? false :
	true;

/**
 * Combines two booleans using logical AND
 */
export type Or<T1 extends boolean, T2 extends boolean> =
	// if one of the arguments is exactly true, return true
	T1 extends true ? true :
	T2 extends true ? true :
	false;

/**
 * Tests if the type TSource is assignable to TTarget
 */
export type AssignableTo<TSource, TTarget> =
	[TSource] extends [TTarget] ? true : false;

/**
 * Tests if two types are equal
 */
export type Equals<T, S> =
	[T] extends [S] ? (
		[S] extends [T] ? true : false
	) : false
	;

/**
 * Creates a union from the numeric keys of an Array or tuple.
 * The result is the union of all fixed entries and (if open-ended or an array) the type `number`
 */
export type IndizesOf<
	T extends any[],
	U = Omit<T, keyof []>,
	NumericKeysOfT = keyof U
> = NumericKeysOfT | (
	// take the numeric keys of T
	// and add number if this is an array or open-ended tuple
	number extends LengthOf<T> ? number : never
);

/**
 * Creates a union from the types of an Array or tuple
 */
export type UnionOf<T extends any[]> = T[number];

/**
 * Returns the length of an array or tuple
 */
export type LengthOf<T extends any[]> = T["length"];

/**
 * Tests if a type is a fixed-length tuple (true) or an Array/open-ended tuple (false)
 */
export type IsTuple<T extends any[]> =
	// if the length is `number`, we either have an array or an open-ended tuple
	number extends LengthOf<T> ? (
		IndizesOf<T> extends number ? false // this is an array or an open-ended tuple of the form [...type[]]
		: true // This is an open-ended tuple with at least 1 item
	) : true; // This is a fixed-length tuple

/**
 * Tests if all types in an array or tuple are assignable to T
 */
export type Every<TArr extends any[], T> = Equals<UnionOf<TArr>, T>;

/**
 * Tests if all types in an array or tuple are strictly equal to T
 */
export type EveryStrict<
	TArr extends T[], T,
	// Only keep the type information for numeric indizes of TArr
	OnlyTupleKeys = Omit<TArr, keyof []>,
	// Test if those are equal to T
	TupleKeysEqualT = { [P in keyof OnlyTupleKeys]: Equals<OnlyTupleKeys[P], T> },
	// Build a union of the results
	AllTupleKeysTrue = TupleKeysEqualT[keyof TupleKeysEqualT]
	> = {
		// empty tuples: T must be never
		"empty": Equals<T, never>,
		// for tuples: return true if the union equals true
		"tuple": Equals<AllTupleKeysTrue, true>,
		// for array: test the array type for strict equality
		"array": T[] extends TArr ? true : false,
	}[
	TArr extends [] ? "empty"
	: IsTuple<TArr> extends true ? "tuple"
	: "array"
	];

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
	U = { [K in keyof T]: { key: K, value: T[K] } }
	> = U[keyof U];

/**
 * Returns the first item's type in a tuple
 */
export type Head<T extends any[]> =
	T extends [infer H, ...any[]] ? H : never;

/**
 * Returns all but the first item's type in a tuple/array
 */
export type Tail<T extends any[]> =
	((...args: T) => any) extends ((head: any, ...tail: infer R) => any) ? R : never;

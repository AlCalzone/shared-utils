/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Negates a boolean
 */
export type Not<T extends boolean> = T extends true ? false : true;

/**
 * Combines two booleans using logical AND
 */
export type And<T1 extends boolean, T2 extends boolean> =
	// if one of the arguments is exactly false, return false
	T1 extends false ? false : T2 extends false ? false : true;

/**
 * Combines two booleans using logical AND
 */
export type Or<T1 extends boolean, T2 extends boolean> =
	// if one of the arguments is exactly true, return true
	T1 extends true ? true : T2 extends true ? true : false;

/**
 * Tests if the type TSource is assignable to TTarget
 */
export type AssignableTo<TSource, TTarget> = [TSource] extends [TTarget]
	? true
	: false;

/**
 * Tests if two types are equal
 */
export type Equals<T, S> = [T] extends [S]
	? [S] extends [T]
		? true
		: false
	: false;

/**
 * Creates a union from the numeric keys of an Array or tuple.
 * The result is the union of all fixed entries and (if open-ended or an array) the type `number`
 */
export type IndizesOf<
	T extends any[],
	U = Omit<T, keyof []>,
	NumericKeysOfT = keyof U,
> =
	| NumericKeysOfT
	// take the numeric keys of T
	// and add number if this is an array or open-ended tuple
	| (number extends LengthOf<T> ? number : never);

/**
 * Creates a union from the numeric keys of an Array or tuple.
 * The result is the union of all fixed entries, but unlike `IndizesOf` does not include the type `number`
 */
export type FixedIndizesOf<T extends any[]> = keyof Omit<T, keyof []>;

/**
 * Creates a union from the types of an Array or tuple
 */
export type UnionOf<T extends any[]> = T[number];

/**
 * Returns the length of an array or tuple
 */
export type LengthOf<T extends any[]> = T extends { length: infer R }
	? R
	: never;

export type IsFixedLength<T extends any[]> =
	// if the length property is `number`, this is not fixed length
	number extends LengthOf<T> ? false : true;

export type IsVariableLength<T extends any[]> = Not<IsFixedLength<T>>;

/**
 * Tests if a type is a fixed-length tuple (true) or an Array/open-ended tuple (false)
 */
export type IsTuple<T extends any[]> =
	IsFixedLength<T> extends true
		? true // This is a fixed-length tuple
		: IndizesOf<T> extends number
			? false // this is an array or an open-ended tuple of the form [...type[]]
			: true; // This is an open-ended tuple with at least 1 item

/** Converts a number between 0 and 99 to its corresponding string representation */
// prettier-ignore
export type ToString<N extends number> = [
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
	"10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
	"20", "21", "22", "23", "24", "25", "26", "27", "28", "29",
	"30", "31", "32", "33", "34", "35", "36", "37", "38", "39",
	"40", "41", "42", "43", "44", "45", "46", "47", "48", "49",
	"50", "51", "52", "53", "54", "55", "56", "57", "58", "59",
	"60", "61", "62", "63", "64", "65", "66", "67", "68", "69",
	"70", "71", "72", "73", "74", "75", "76", "77", "78", "79",
	"80", "81", "82", "83", "84", "85", "86", "87", "88", "89",
	"90", "91", "92", "93", "94", "95", "96", "97", "98", "99"
][N];

/**
 * Tests if all types in an array or tuple are assignable to T
 */
export type Every<TArr extends any[], T> = Equals<UnionOf<TArr>, T>;

/**
 * Tests if all types in an array or tuple are strictly equal to T
 */
export type EveryStrict<
	TArr extends T[],
	T,
	// Only keep the type information for numeric indizes of TArr
	OnlyTupleKeys = Omit<TArr, keyof []>,
	// Test if those are equal to T
	TupleKeysEqualT = {
		[P in keyof OnlyTupleKeys]: Equals<OnlyTupleKeys[P], T>;
	},
	// Build a union of the results
	AllTupleKeysTrue = TupleKeysEqualT[keyof TupleKeysEqualT],
> = {
	// empty tuples: T must be never
	empty: Equals<T, never>;
	// for tuples: return true if the union equals true
	tuple: Equals<AllTupleKeysTrue, true>;
	// for array: test the array type for strict equality
	array: T[] extends TArr ? true : false;
}[TArr extends [] ? "empty" : IsTuple<TArr> extends true ? "tuple" : "array"];

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
export type SemiPartial<T, K extends keyof T> = T extends never
	? never
	: Omit<T, K> & Optional<T, K>;

/**
 * Extracts a union of possible key-value pairs from type T
 * @returns A union of `{key, value}` objects where `key` can take the values of `keyof T` and `value` the corresponding property types.
 */
export type KeyValuePairsOf<
	T extends Record<string, any>,
	U = { [K in keyof T]: { key: K; value: T[K] } },
> = U[keyof U];

/**
 * Returns a simplified representation of the type T. For example:
 * Pick<{a: number, b: string }, "b"> & { a?: boolean } => { b: string, a?: boolean }
 */
export type Simplify<T extends object> = { [K in keyof T]: T[K] };

/**
 * Returns a composite type with the properties of T that are not in U plus all properties from U
 */
export type Overwrite<T extends object, U extends object> = Simplify<
	Omit<T, keyof T & keyof U> & U
>;

/**
 * Returns the first item's type in a tuple
 */
export type Head<T extends any[]> = T extends [infer R, ...any[]] ? R : never;
/**
 * Returns all but the first item's type in a tuple/array
 */
export type Tail<T extends any[]> =
	// Tail is an identity operation for array types (without fixed indizes)
	[FixedIndizesOf<T>] extends [never]
		? T
		: // For tuples, just omit the first item
			T extends [any, ...infer R]
			? R
			: [];
/**
 * Returns all but the last item's type in a tuple/array
 */
export type Lead<T extends unknown[]> = T extends []
	? []
	: // tuple with at least one trailing item
		T extends [...infer L1, infer _]
		? L1
		: // tuple with trailing rest element / array
			T extends [...infer L2]
			? L2
			: [];

/**
 * Returns the last item's type in a tuple
 */
export type Last<T extends unknown[]> = T extends []
	? never
	: T extends [...infer _, infer R]
		? R
		: T extends [...infer _, (infer R)?]
			? R | undefined
			: never;

/**
 * Returns the given tuple/array with the item type prepended to it
 */
export type Unshift<List extends any[], Item> = [Item, ...List];

/**
 * Returns the given tuple/array with the item type appended to it
 */
export type Push<List extends any[], Item> = [...List, Item];

/**
 * Concatenates the given tuples
 */
export type Concat<T1 extends any[], T2 extends any[]> = [...T1, ...T2];

/**
 * Forces T to be of type Type - This can discard type information
 */
type ForceType<T, Type> = T extends Type ? T : Type;

/**
 * Returns the Nth argument of F (0-based)
 */
export type ArgumentAt<
	F extends (...args: any[]) => any,
	N extends number,
	NStr extends string = ToString<N>,
	ArgsTuple extends any[] = Parameters<F>,
	Ret = IsVariableLength<ArgsTuple> extends true
		? // keep variable length-tuples as-is
			ArgsTuple[N]
		: // fixed length tuples need their non-existent indizes to be filled with never
			NStr extends IndizesOf<ArgsTuple>
			? ArgsTuple[NStr]
			: never,
> = Ret;

/** Takes the elements from T2 that have a corresponding index in T1 */
type MapTuples<T1 extends any[], T2 extends any[]> = {
	[K in keyof T1]: K extends keyof T2 ? T2[K] : never;
};

/**
 * Marking a parameter of a generic function with `NoInfer` causes its type
 * to be inferred from other arguments with the same type instead of creating a union.
 * Example:
 * ```ts
 const foo = <T>(arg1: T, arg2: T) => arg2;
 foo({a: 1}, {b: 2})
 // gets inferred as {a: number, b?: undefined} | {a?: undefined, b: number}
 const bar = <T>(arg1: T, arg2: NoInfer<T>) => arg2;
 bar({a: 1}, {b: 2})
 // is an error: "a" is missing in type {b: 2}
 ```
 */
export type NoInfer<T> = T & { [K in keyof T]: T[K] };

/** Returns the type of the last argument of a function */
export type LastArgument<T extends (...args: any[]) => any> = Last<
	Parameters<T>
>;

/** Returns the "return" type of a callback-style API */
export type CallbackAPIReturnType<
	T extends (...args: any[]) => any,
	TCb extends (...args: any[]) => any = LastArgument<T>,
	TCbArgs = Parameters<Exclude<TCb, undefined>>,
> = TCbArgs extends [(Error | null | undefined)?]
	? void
	: TCbArgs extends [Error | null | undefined, infer U]
		? U
		: TCbArgs extends any[]
			? TCbArgs[1]
			: never;

/**
 * Returns a promisified function signature for the given callback-style function.
 */
export type Promisify<
	T extends (...args: any[]) => any,
	TReturn = CallbackAPIReturnType<T>,
	TArgs extends any[] = Lead<Parameters<T>>,
> = (...args: TArgs) => Promise<TReturn>;

// TupleOf type taken from https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787
type BuildPowersOf2LengthArrays<
	N extends number,
	R extends never[][],
> = R[0][N] extends never
	? R
	: BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>;

type ConcatLargestUntilDone<
	N extends number,
	R extends never[][],
	B extends never[],
> = B["length"] extends N
	? B
	: [...R[0], ...B][N] extends never
		? ConcatLargestUntilDone<
				N,
				R extends [R[0], ...infer U]
					? U extends never[][]
						? U
						: never
					: never,
				B
			>
		: ConcatLargestUntilDone<
				N,
				R extends [R[0], ...infer U]
					? U extends never[][]
						? U
						: never
					: never,
				[...R[0], ...B]
			>;

type Replace<R extends any[], T> = { [K in keyof R]: T };

/** Creates a tuple of the given type with the given length */
export type TupleOf<T, N extends number> = number extends N
	? T[]
	: {
			[K in N]: BuildPowersOf2LengthArrays<K, [[never]]> extends infer U
				? U extends never[][]
					? Replace<ConcatLargestUntilDone<K, U, []>, T>
					: never
				: never;
		}[N];

/**
 * Creates a Union of all numbers (converted to string) from 0 to N (exclusive)
 * WARNING: This uses a recursive type definition which might stop working at any point
 * N = 100000 seems to work currently.
 */
export type Range<N extends number> = IndizesOf<TupleOf<never, N>>;

/**
 * Creates a Union of all numbers from N (inclusive) to M (exclusive)
 * WARNING: This uses a recursive type definition which might stop working at any point
 * N = 100000 seems to work currently.
 */
export type RangeFrom<N extends number, M extends number> = Exclude<
	Range<M>,
	Range<N>
>;

/** Tests if N > M */
export type IsGreaterThan<
	N extends number,
	M extends number,
	RangeN = Range<N>,
	RangeM = Range<M>,
	RangeDiff = Exclude<RangeN, RangeM>,
> = [RangeDiff] extends [never] ? false : true;

/** Tests if N <= M */
export type IsLessThanOrEqual<
	N extends number,
	M extends number,
	RangeN = Range<N>,
	RangeM = Range<M>,
	RangeDiff = Exclude<RangeN, RangeM>,
> = [RangeDiff] extends [never] ? true : false;

/** Tests if N < M */
export type IsLessThan<
	N extends number,
	M extends number,
	RangeN = Range<N>,
	RangeM = Range<M>,
	RangeDiff = Exclude<RangeM, RangeN>,
> = [RangeDiff] extends [never] ? false : true;

/** Tests if N >= M */
export type IsGreaterThanOrEqual<
	N extends number,
	M extends number,
	RangeN = Range<N>,
	RangeM = Range<M>,
	RangeDiff = Exclude<RangeM, RangeN>,
> = [RangeDiff] extends [never] ? true : false;

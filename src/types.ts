// TSLint seems to have problems with whitespace in rest tuples
// tslint:disable:whitespace

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

export type IsFixedLength<T extends any[]> =
	// if the length property is `number`, this is not fixed length
	number extends LengthOf<T> ? false : true;

export type IsVariableLength<T extends any[]> = Not<IsFixedLength<T>>;

/**
 * Tests if a type is a fixed-length tuple (true) or an Array/open-ended tuple (false)
 */
export type IsTuple<T extends any[]> =
	IsFixedLength<T> extends true ? true  // This is a fixed-length tuple
	: IndizesOf<T> extends number ? false // this is an array or an open-ended tuple of the form [...type[]]
	: true;								  // This is an open-ended tuple with at least 1 item

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
 * Returns a simplified representation of the type T. For example:
 * Pick<{a: number, b: string }, "b"> & { a?: boolean } => { b: string, a?: boolean }
 */
export type Simplify<T extends object> = {[K in keyof T]: T[K]};

/**
 * Returns a composite type with the properties of T that are not in U plus all properties from U
 */
export type Overwrite<T extends object, U extends object> = Simplify<Omit<T, keyof T & keyof U> & U>;

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

/**
 * Returns the given tuple/array with the item type prepended to it
 */
export type Unshift<List extends any[], Item> =
	((first: Item, ...rest: List) => any) extends ((...list: infer R) => any) ? R : never;

/**
 * Returns a tuple of the function parameter types
 */
export type Arguments<F extends (...args: any[]) => any> = F extends ((...args: infer R) => any) ? R : never;

/**
 * Returns the Nth argument of F (0-based)
 */
export type ArgumentAt<
	F extends (...args: any[]) => any,
	N extends number,
	ArgsTuple extends any[] = Arguments<F>,
	Args = IsVariableLength<ArgsTuple> extends true
		// keep variable length-tuples as-is
		? ArgsTuple
		// fixed length tuples need their non-existent indizes to be filled with never
		: never[] & ArgsTuple,
	// @ts-ignore N can be used to index Args
	Ret = Args[N]
> = Ret;

/** Takes the elements from T2 that have a corresponding index in T1 */
type MapTuples<T1 extends any[], T2 extends any[]> = { [K in keyof T1]: K extends keyof T2 ? T2[K] : never };

type TakeLastFixed<
	T extends any[],
	// Create a tuple which is 1 item shorter than T and determine its length
	L1 extends number = Tail<T>["length"],
	// use that length to access the last index of T
	> = T[L1];

// A variable-length tuple has two potential last items:
// the last fixed one and the type of the variable range
type TakeLastVariable<
	T extends any[],
	// so we take the indizes of a tuple that is one shorter than T,
	MinusOne = keyof Tail<T>,
	// and the indizes of one that is one longer than T,
	PlusOne = keyof Unshift<T, never>,
	// and use the difference of that (= [length - 1, length])
	// to index those two possible items
	Index = Exclude<PlusOne, MinusOne>,
	// @ts-ignore Index CAN be used to index T!
	U = T[Index]
	> = U;

/** Returns the last item in a tuple */
export type TakeLast<T extends any[]> =
	IsFixedLength<T> extends true
	? TakeLastFixed<T>
	: TakeLastVariable<T>;

/** Removes the last item from a tuple */
export type DropLast<
	T extends any[],
	// Determine the length of L
	L extends number = LengthOf<T>,
	// create a tuple that is 1 shorter than T
	MinusOne extends any[]= Tail<T>,
	// and keep only the entries with a corresponding index in T
	> = Equals<L, number> extends true
	// this is an open-ended tuple or array, dropping the last item does nothing
	? T
	// this is a fixed-length tuple, we can drop one
	: MapTuples<MinusOne, T>;

/** Forces T to be a tuple - this might discard type information */
type ForceTuple<T> = T extends any[] ? T : any[];
/** Forces T to be a function - this might discard type information */
type ForceFunction<T> = T extends ((...args: any[]) => any) ? T : ((...args: any[]) => any);

/**
 * Returns a promisified function signature for the given callback-style function
 * WARNING: This is still experimental. The names of the inferred signature args are off by one!
 */
export type Promisify<
	F extends (...args: any[]) => void,
	// Extract the argument types
	FArgs extends any[]= Arguments<F>,
	// Infer the arguments for the promisified version
	PromiseArgs extends any[]= ForceTuple<DropLast<FArgs>>,
	// Parse the callback args
	CallbackArgs extends any[]= Arguments<ForceFunction<TakeLast<FArgs>>>,
	CallbackLength = LengthOf<CallbackArgs>,
	TError = CallbackArgs[0],
	// And extract the return value
	TResult = 1 extends CallbackLength ? void : CallbackArgs[1]
	> = (...args: PromiseArgs) => Promise<TResult>;

// tslint:disable:jsdoc-format => code cannot have leading asterisks
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
export type NoInfer<T> = T & {[K in keyof T]: T[K]};
// tslint:enable:jsdoc-format

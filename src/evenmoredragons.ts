/**
 * Returns the length of an array or tuple
 */
export type LengthOf<T extends any[]> = T["length"];

/**
 * Returns the logarithm to the base 2 of the (L + 1)
 */
export type Magnitude<L> =
	number extends L ? never : (
		L extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 ?
		L extends 0 | 1 | 2 | 3 ?
		L extends 0 | 1 ?
		L extends 0 ?
		0 : 1 : 2 : 3 : 4
	);

// Take the first N items of T
type Take1<T extends any[]> = ((...args: T) => void) extends ((a1: infer A1, ...rest: any[]) => void) ? [A1] : never;
type Take2<T extends any[]> = ((...args: T) => void) extends ((a1: infer A1, a2: infer A2, ...rest: any[]) => void) ? [A1, A2] : never;
type Take4<T extends any[]> = ((...args: T) => void) extends ((a1: infer A1, a2: infer A2, a3: infer A3, a4: infer A4, ...rest: any[]) => void) ? [A1, A2, A3, A4] : never;
type Take8<T extends any[]> = ((...args: T) => void) extends ((a1: infer A1, a2: infer A2, a3: infer A3, a4: infer A4, a5: infer A5, a6: infer A6, a7: infer A7, a8: infer A8, ...rest: any[]) => void) ? [A1, A2, A3, A4, A5, A6, A7, A8] : never;

// Drop the first N items of T
type Drop1<T extends any[]> = ((...args: T) => void) extends ((a1: any, ...rest: infer R) => void) ? R : never;
type Drop2<T extends any[]> = ((...args: T) => void) extends ((a1: any, a2: any, ...rest: infer R) => void) ? R : never;
type Drop4<T extends any[]> = ((...args: T) => void) extends ((a1: any, a2: any, a3: any, a4: any, ...rest: infer R) => void) ? R : never;
type Drop8<T extends any[]> = ((...args: T) => void) extends ((a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, ...rest: infer R) => void) ? R : never;

// Take the first N items of T1, reverse them and prepend them to T2
type ConcatReverse1<T1 extends any[], T2 extends any[]> = ((a1: T1[0], ...rest: T2) => void) extends ((...args: infer R) => void) ? R : never;
type ConcatReverse2<T1 extends any[], T2 extends any[]> = ((a2: T1[1], a1: T1[0], ...rest: T2) => void) extends ((...args: infer R) => void) ? R : never;
type ConcatReverse4<T1 extends any[], T2 extends any[]> = ((a4: T1[3], a3: T1[2], a2: T1[1], a1: T1[0], ...rest: T2) => void) extends ((...args: infer R) => void) ? R : never;
type ConcatReverse8<T1 extends any[], T2 extends any[]> = ((a8: T1[7], a7: T1[6], a6: T1[5], a5: T1[4], a4: T1[3], a3: T1[2], a2: T1[1], a1: T1[0], ...rest: T2) => void) extends ((...args: infer R) => void) ? R : never;

export type ConcatReverse<
	T1 extends any[], T2 extends any[]=[],
	L = LengthOf<T1>,
	> = {
		0: T2,
		// depending on the length of T1, take the first half of T1,
		// and prepend it to T2 in a reversed order
		1: ConcatReverse<Drop1<T1>, ConcatReverse1<T1, T2>>,
		2: ConcatReverse<Drop2<T1>, ConcatReverse2<T1, T2>>,
		3: ConcatReverse<Drop4<T1>, ConcatReverse4<T1, T2>>,
		4: ConcatReverse<Drop8<T1>, ConcatReverse8<T1, T2>>,
	}[Magnitude<T1["length"]>];

export type Unshift<List extends any[], Item> =
	((first: Item, ...rest: List) => any) extends ((...list: infer R) => any) ? R : never;

type ReverseNaive<
	Source extends any[], Target extends any[]=[],
	Left extends any[]= Drop1<Source>,
	Right extends any[]= Unshift<Target, Source[0]>,
	> = {
		0: Target,
		1: ReverseNaive<Left, Right>,
	}[Source["length"] extends 0 ? 0 : 1];

/**
 * Reverses the given list
 * WARNING: Use at your own risk, this might crash TypeScript
 */
// export type Reverse<T extends any[]> = ConcatReverse<T>;

type DropLast<
	T extends any[],
	U extends any[]= ReverseNaive<T>, // error here, but it works!
	V extends any[]= Drop1<U>,
	W extends any[]= ReverseNaive<V>
	> = W;

// inspired by https://github.com/fightingcat/Typescript4Fun/blob/master/src/tuple.d.ts
// Some dangerous recursive operations!
// Beware of the dragons!

import { LengthOf } from "./types";

/**
 * Returns the logarithm to the base 2 of the length of T
 */
export type LenLog2<
	T extends any[],
	L = LengthOf<T>
> = number extends L ? never :
	L extends 0 ? never : (
	L extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 ?
	L extends 1 | 2 | 3 | 4 ?
	L extends 1 | 2 ?
	L extends 1 ?
	0 : 1 : 2 : 3 : 4
);

/**
 * Returns the logarithm to the base 2 of the (length of T + 1)
 */
export type Magnitude<
	T extends any[],
	L = LengthOf<T>
> = number extends L ? never : (
	L extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 ?
	L extends 0 | 1 | 2 | 3 ?
	L extends 0 | 1 ?
	L extends 0 ?
	0 : 1 : 2 : 3 : 4
);

/**
 * Returns the last item in T
 */
export type Last<
	T extends any[]
> = {
	0: T[0],
	// depending on the length of T, drop the first half of it
	1: Last<Drop1<T>>,
	2: Last<Drop2<T>>,
	3: Last<Drop4<T>>,
	4: Last<Drop8<T>>,
}[LenLog2<T>];

export type ConcatReverse<
	T1 extends any[], T2 extends any[] = []
> = {
	0: T2,
	// depending on the length of T1, take the first half of T1,
	// and prepend it to T2 in a reversed order
	1: ConcatReverse<Drop1<T1>, ConcatReverse1<Take1<T1>, T2>>,
	2: ConcatReverse<Drop2<T1>, ConcatReverse2<Take2<T1>, T2>>,
	3: ConcatReverse<Drop4<T1>, ConcatReverse4<Take4<T1>, T2>>,
	4: ConcatReverse<Drop8<T1>, ConcatReverse8<Take8<T1>, T2>>,
}[Magnitude<T1>];

/**
 * Returns the first item's type in a tuple
 */
export type Head<T extends any[]> = Take1<T>;
/**
 * Returns all but the first item's type in a tuple/array
 */
export type Tail<T extends any[]> = Drop1<T>;

/**
 * Reverses the given list
 * WARNING: Use at your own risk, this might crash TypeScript
 */
export type Reverse<T extends any[]> = ConcatReverse<T>;

/**
 * Returns the given tuple/array with the item type prepended to it
 */
export type Unshift<List extends any[], Item> = ConcatReverse1<[Item], List>;

// Tis a big dragon: (This crashes TSServer)
// export type Push<List extends any[], Item> = ConcatReverse<ConcatReverse<[Item], ConcatReverse<List>>>;

// Drop the first N items of T
type Drop1<T extends any[]> = ((...args: T) => void) extends ((a1: any, ...rest: infer R) => void) ? R : never;
type Drop2<T extends any[]> = ((...args: T) => void) extends ((a1: any, a2: any, ...rest: infer R) => void) ? R : never;
type Drop4<T extends any[]> = ((...args: T) => void) extends ((a1: any, a2: any, a3: any, a4: any, ...rest: infer R) => void) ? R : never;
type Drop8<T extends any[]> = ((...args: T) => void) extends ((a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, ...rest: infer R) => void) ? R : never;
// Take the first N items of T
type Take1<T extends any[]> = ((...args: T) => void) extends ((a1: infer A1, ...rest: any[]) => void) ? [A1] : never;
type Take2<T extends any[]> = ((...args: T) => void) extends ((a1: infer A1, a2: infer A2, ...rest: any[]) => void) ? [A1, A2] : never;
type Take4<T extends any[]> = ((...args: T) => void) extends ((a1: infer A1, a2: infer A2, a3: infer A3, a4: infer A4, ...rest: any[]) => void) ? [A1, A2, A3, A4] : never;
type Take8<T extends any[]> = ((...args: T) => void) extends ((a1: infer A1, a2: infer A2, a3: infer A3, a4: infer A4, a5: infer A5, a6: infer A6, a7: infer A7, a8: infer A8, ...rest: any[]) => void) ? [A1, A2, A3, A4, A5, A6, A7, A8] : never;

// Take the first N items of T1, reverse them and prepend them to T2
type ConcatReverse1<T1 extends any[], T2 extends any[]> = ((a1: T1[0], ...rest: T2) => void) extends ((...args: infer R) => void) ? R : never;
type ConcatReverse2<T1 extends any[], T2 extends any[]> = ((a2: T1[1], a1: T1[0], ...rest: T2) => void) extends ((...args: infer R) => void) ? R : never;
type ConcatReverse4<T1 extends any[], T2 extends any[]> = ((a4: T1[3], a3: T1[2], a2: T1[1], a1: T1[0], ...rest: T2) => void) extends ((...args: infer R) => void) ? R : never;
type ConcatReverse8<T1 extends any[], T2 extends any[]> = ((a8: T1[7], a7: T1[6], a6: T1[5], a5: T1[4], a4: T1[3], a3: T1[2], a2: T1[1], a1: T1[0], ...rest: T2) => void) extends ((...args: infer R) => void) ? R : never;

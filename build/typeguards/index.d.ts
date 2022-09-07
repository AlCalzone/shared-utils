/**
 * Tests whether the given variable is a real object and not an Array
 * @param it The variable to test
 */
export declare function isObject<T>(it: T): it is T & Record<string, unknown>;
declare type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;
declare type IsAny<T> = IfAny<T, true, never>;
declare type ExtractArray<T> = true extends IsAny<T> ? unknown[] : T extends readonly unknown[] ? T : unknown extends T ? (T & unknown[]) : never;
/**
 * Tests whether the given variable is really an Array
 * @param it The variable to test
 */
export declare function isArray<T>(it: T): it is T & ExtractArray<T>;
export {};

/**
 * Tests whether the given variable is a real object and not an Array
 * @param it The variable to test
 */
export function isObject<T>(it: T): it is T & Record<string, unknown> {
	// This is necessary because:
	// typeof null === 'object'
	// typeof [] === 'object'
	// [] instanceof Object === true
	return Object.prototype.toString.call(it) === "[object Object]";
}

type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N; 
type IsAny<T> = IfAny<T, true, never>;

type ExtractArray<T> = 
     true extends IsAny<T> ? unknown[]
     : T extends unknown[] ? T
     : unknown extends T ? (T & unknown[])
     : never;

/**
 * Tests whether the given variable is really an Array
 * @param it The variable to test
 */
export function isArray<T>(it: T): it is T & ExtractArray<T> {
	if (Array.isArray != null) return Array.isArray(it);
	return Object.prototype.toString.call(it) === "[object Array]";
}

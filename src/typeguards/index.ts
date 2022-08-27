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

type ExtractArray<T> = T extends unknown[] ? T : (T & unknown[]);

/**
 * Tests whether the given variable is really an Array
 * @param it The variable to test
 */
export function isArray<T>(it: T): it is ExtractArray<T> {
	if (Array.isArray != null) return Array.isArray(it);
	return Object.prototype.toString.call(it) === "[object Array]";
}

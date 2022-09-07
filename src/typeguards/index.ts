/**
 * Tests whether the given variable is a real object and not an Array
 * @param it The variable to test
 */

// We need an extensive conditional type here because TS stopped simplifying/narrowing
// correctly in 4.8 (https://github.com/microsoft/TypeScript/issues/50671)
export function isObject<T>(it: T): it is {} extends T
	? // Narrow the `{}` type to an unspecified object
	  T & Record<string | number | symbol, unknown>
	: unknown extends T
	? // treat unknown like `{}`
	  T & Record<string | number | symbol, unknown>
	: T extends object // function, array, {} or actual object
	? T extends readonly unknown[]
		? never // not an array
		: T extends (...args: any[]) => any
		? never // not a function
		: T // no, an actual object
	: never {

	// This is necessary because:
	// typeof null === 'object'
	// typeof [] === 'object'
	// [] instanceof Object === true
	return Object.prototype.toString.call(it) === "[object Object]";
}

/**
 * Tests whether the given variable is really an Array
 * @param it The variable to test
 */

// We need an extensive conditional type here because TS stopped simplifying/narrowing
// correctly in 4.8 (https://github.com/microsoft/TypeScript/issues/50671)
export function isArray<T>(
	it: T,
): it is T extends readonly unknown[]
	? T
	: {} extends T
	? T & unknown[]
	: never {
	if (Array.isArray != null) return Array.isArray(it);
	return Object.prototype.toString.call(it) === "[object Array]";
}

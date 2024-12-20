export type Predicate<T> = (value: T, key: string) => boolean;
export type KeyValuePair<T> = [string, T];

/**
 * Returns a subset of an object, whose properties match the given predicate
 * @param obj The object whose properties should be filtered
 * @param predicate A predicate function which is applied to the object's properties
 */
export function filter<T = any>(
	obj: Record<string, T>,
	predicate: Predicate<T>,
): Record<string, T> {
	return Object.fromEntries(
		Object.entries(obj).filter(([key, value]) => predicate(value, key)),
	);
}

/**
 * Deep merges multiple objects onto the target object.
 * This modifies the target object, so pass undefined or {}
 * to create a new object.
 */
export function extend(
	target: Record<string, any> | undefined | null,
	...sources: Record<string, any>[]
): Record<string, any> {
	if (target == null) target = {};
	for (const source of sources) {
		for (const [prop, val] of Object.entries(source)) {
			if (val === null) {
				// copy null values
				target[prop] = val;
			} else if (
				typeof target[prop] === "object" &&
				typeof val === "object"
			) {
				// merge objects if both properties are objects
				target[prop] = extend(target[prop], val);
			} else if (typeof val === "object") {
				// create a copy of the source object if the target is primitive
				target[prop] = extend({}, val);
			} else {
				// copy primitive values
				target[prop] = val;
			}
		}
	}
	return target;
}

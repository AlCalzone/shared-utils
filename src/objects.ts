export type Predicate<T> = (value: T, key: string) => boolean;
export type KeyValuePair<T> = [string, T];

/** Provides a polyfill for Object.entries */
export function entries<T = any>(obj: Record<string, T>) {
	return Object.keys(obj)
		.map(key => [key, obj[key]] as KeyValuePair<T>)
		;
}

/** Provides a polyfill for Object.values */
export function values<T = any>(obj: Record<string, T>): T[] {
	return Object.keys(obj)
		.map(key => obj[key])
		;
}

/**
 * Returns a subset of an object, whose properties match the given predicate
 * @param obj The object whose properties should be filtered
 * @param predicate A predicate function which is applied to the object's properties
 */
export function filter<T = any>(obj: Record<string, T>, predicate: Predicate<T>): Record<string, T> {
	return composeObject(
		entries(obj).filter(([key, value]) => predicate(value, key)),
	);
}

/**
 * Combines multiple key value pairs into an object
 * @param properties The key value pairs to combine into an object
 */
export function composeObject<T = any>(properties: KeyValuePair<T>[]) {
	return properties.reduce((acc: Record<string, any>, [key, value]) => {
		acc[key] = value;
		return acc;
	}, {});
}

/**
 * Deep merges multiple objects onto the target object.
 * This modifies the target object, so pass undefined or {}
 * to create a new object.
 */
export function extend(
	target: Record<string, any> = {},
	// tslint:disable-next-line:trailing-comma
	...sources: Record<string, any>[]
) {
	for (const source of sources) {
		for (const [prop, val] of entries(source)) {
			if (val instanceof Object) {
				target[prop] = extend(target[prop], val);
			} else {
				target[prop] = val;
			}
		}
	}
	return target;
}

// // Kopiert Eigenschaften rekursiv von einem Objekt auf ein anderes
// export function extend(target: any, source: any) {
// 	target = target || {};
// 	for (const [prop, val] of entries(source)) {
// 		if (val instanceof Object) {
// 			target[prop] = extend(target[prop], val);
// 		} else {
// 			target[prop] = val;
// 		}
// 	}
// 	return target;
// }

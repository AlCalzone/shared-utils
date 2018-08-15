/** @module async */

///
/// Stellt einen Promise-Wrapper für asynchrone Node-Funktionen zur Verfügung
///

// tslint:disable:ban-types
export function promisify<T>(fn: Function, context?: any): (...args: any[]) => Promise<T>;
export function promisify(fn: Function, context?: any) {
	return function(...args: any[]) {
		context = context || this;
		return new Promise((resolve, reject) => {
			fn.apply(context, [...args, (error: Error, result: any) => {
				if (error) {
					return reject(error);
				} else {
					return resolve(result);
				}
			}]);
		});
	};
}

export function promisifyNoError<T>(fn: Function, context?: any): (...args: any[]) => Promise<T>;
export function promisifyNoError(fn: Function, context?: any) {
	return function(...args: any[]) {
		context = context || this;
		return new Promise((resolve) => {
			fn.apply(context, [...args, (result: any) => {
				return resolve(result);
			}]);
		});
	};
}
// tslint:enable:ban-types

/** Creates a promise that waits for the specified time and then resolves */
export function wait(ms: number): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});
}

export type PromiseFactory<T> = () => Promise<T>;

/**
 * Executes the given promise-returning functions in sequence
 * @param promiseFactories An array of promise-returning functions
 * @returns An array containing all return values of the executed promises
 */
export async function promiseSequence<T>(promiseFactories: Iterable<PromiseFactory<T>>) {
	const ret: T[] = [];
	for (const f of promiseFactories) {
		ret.push(await f());
	}
	return ret;
}

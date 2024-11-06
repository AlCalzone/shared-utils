/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export function promisify<T>(
	fn: Function,
	context?: any,
): (...args: any[]) => Promise<T>;
export function promisify(fn: Function, context?: any) {
	return function (this: any, ...args: any[]): Promise<any> {
		context = context || this;
		return new Promise((resolve, reject) => {
			fn.apply(context, [
				...args,
				(error: Error, result: any) => {
					if (error) {
						return reject(error);
					} else {
						return resolve(result);
					}
				},
			]);
		});
	};
}

export function promisifyNoError<T>(
	fn: Function,
	context?: any,
): (...args: any[]) => Promise<T>;
export function promisifyNoError(fn: Function, context?: any) {
	return function (this: any, ...args: any[]): Promise<any> {
		context = context || this;
		return new Promise((resolve) => {
			fn.apply(context, [
				...args,
				(result: any) => {
					return resolve(result);
				},
			]);
		});
	};
}
/* eslint-enable @typescript-eslint/no-unsafe-function-type */

/**
 * Creates a promise that waits for the specified time and then resolves
 * @param unref Whether `unref()` should be called on the timeout
 */
export function wait(ms: number, unref: boolean = false): Promise<void> {
	return new Promise<void>((resolve) => {
		const timeout = setTimeout(resolve, ms);
		// In a browser context (Electron), unref is not necessary or possible
		if (unref && typeof timeout !== "number") timeout.unref();
	});
}

export type PromiseFactory<T> = () => Promise<T>;

/**
 * Executes the given promise-returning functions in sequence
 * @param promiseFactories An array of promise-returning functions
 * @returns An array containing all return values of the executed promises
 */
export async function promiseSequence<T>(
	promiseFactories: Iterable<PromiseFactory<T>>,
): Promise<T[]> {
	const ret: T[] = [];
	for (const f of promiseFactories) {
		ret.push(await f());
	}
	return ret;
}

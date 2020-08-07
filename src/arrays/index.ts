/**
 * Reduces an array to only unique values
 */
export function distinct<T extends number | string | boolean>(arr: T[]): T[] {
	// This is stupidly simple but seems to be one of the fastest methods to do this
	return [...new Set(arr)];
}

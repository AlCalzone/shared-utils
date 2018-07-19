// shameless copy from https://github.com/Microsoft/TypeScript/issues/25760#issuecomment-406158222

/**
 * Excludes the properties K from type T
 */
export type Omit<T, K> = { [P in Exclude<keyof T, K>]: T[P] };

/**
 * Builds a subset of type T with the properties K that are all optional
 */
export type Optional<T, K> = { [P in Extract<keyof T, K>]+?: T[P] };

/**
 * Makes the properties K in type T optional
 */
export type SemiPartial<T, K extends keyof T> = T extends never ? never : Omit<T, K> & Optional<T, K>;

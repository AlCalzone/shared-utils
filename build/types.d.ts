/**
 * Excludes the properties K from type T
 */
export declare type Omit<T, K> = {
    [P in Exclude<keyof T, K>]: T[P];
};
/**
 * Builds a subset of type T with the properties K that are all optional
 */
export declare type Optional<T, K> = {
    [P in Extract<keyof T, K>]+?: T[P];
};
/**
 * Makes the properties K in type T optional
 */
export declare type SemiPartial<T, K extends keyof T> = T extends never ? never : Omit<T, K> & Optional<T, K>;

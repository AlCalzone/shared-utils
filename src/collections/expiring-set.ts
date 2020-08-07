import { EventEmitter } from "events";

interface ExpiringSetEventCallbacks<T> {
	expired: (entry: T) => void;
}
type ExpiringSetEvents<T> = keyof ExpiringSetEventCallbacks<T>;

export interface ExpiringSet<T> {
	on<TEvent extends ExpiringSetEvents<T>>(
		event: TEvent,
		callback: ExpiringSetEventCallbacks<T>[TEvent],
	): this;
	removeListener<TEvent extends ExpiringSetEvents<T>>(
		event: TEvent,
		callback: ExpiringSetEventCallbacks<T>[TEvent],
	): this;
	removeAllListeners(event?: ExpiringSetEvents<T>): this;
}

/**
 * A Set that automatically removes items after a certain time has elapsed since they were added
 */
export class ExpiringSet<T> extends EventEmitter {
	// The internal set used to store values
	private _set: Set<T>;
	private _timeouts = new Map<T, NodeJS.Timeout>();

	/**
	 * The time in milliseconds each entry will last
	 */
	public readonly expiryTime: number;

	public constructor(
		expiryTime: number,
		iterable?: Iterable<T> | null | undefined,
	) {
		super();
		if (expiryTime < 1) {
			throw new Error("The expiry time must be a positive integer");
		}
		this.expiryTime = expiryTime;
		this._set = new Set(iterable);
		this._set.forEach(entry => this.queueForExpiry(entry));
	}

	private queueForExpiry(entry: T): void {
		// Clear old timeouts
		if (this._timeouts.has(entry)) {
			clearTimeout(this._timeouts.get(entry)!);
		}

		const newTimeout = setTimeout(() => {
			this._set.delete(entry);
			this._timeouts.delete(entry);
			this.emit("expired", entry);
		}, this.expiryTime).unref();
		this._timeouts.set(entry, newTimeout);
	}

	public add(value: T): this {
		this._set.add(value);
		this.queueForExpiry(value);
		return this;
	}

	public clear(): void {
		this._set.clear();
		this._timeouts.forEach(timeout => clearTimeout(timeout));
		this._timeouts.clear();
	}

	public delete(value: T): boolean {
		const ret = this._set.delete(value);
		if (this._timeouts.has(value)) {
			clearTimeout(this._timeouts.get(value)!);
			this._timeouts.delete(value);
		}
		return ret;
	}

	public forEach(
		callbackfn: (value: T, value2: T, set: ExpiringSet<T>) => void,
		thisArg?: any,
	): void {
		this._set.forEach((v1, v2) => callbackfn(v1, v2, this), thisArg);
	}

	public has(value: T): boolean {
		return this._set.has(value);
	}

	public get size(): number {
		return this._set.size;
	}

	/** Iterates over values in the set. */
	public [Symbol.iterator](): IterableIterator<T> {
		return this._set[Symbol.iterator]();
	}

	/**
	 * Returns an iterable of [v,v] pairs for every value `v` in the set.
	 */
	public entries(): IterableIterator<[T, T]> {
		return this._set.entries();
	}

	/**
	 * Despite its name, returns an iterable of the values in the set,
	 */
	public keys(): IterableIterator<T> {
		return this._set.keys();
	}

	/**
	 * Returns an iterable of values in the set.
	 */
	public values(): IterableIterator<T> {
		return this._set.values();
	}
}

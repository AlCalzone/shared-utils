/** @module sorted-list */

import { Comparer, defaultComparer } from "../comparable";

interface SortedListNode<T> {
	value: T;
	prev: SortedListNode<T>;
	next: SortedListNode<T>;
}

/**
 * Seeks the list from the beginning and finds the position to add the new item
 */
function findPrevNode<T>(firstNode: SortedListNode<T>, item: T, comparer: Comparer<T>): SortedListNode<T> {
	let ret: SortedListNode<T>;
	let prevNode = firstNode;
	// while item > prevNode.value
	while (prevNode != null && comparer(prevNode.value, item) > 0) {
		ret = prevNode;
		prevNode = prevNode.next;
	}
	return ret;
}

/**
 * Seeks the list from the beginning and finds an item in the list
 */
function findNode<T>(firstNode: SortedListNode<T>, item: T, comparer: Comparer<T>): SortedListNode<T> {
	let curNode = firstNode;
	// while item > prevNode.value
	while (curNode != null) {
		if (comparer(curNode.value, item) === 0) return curNode;
		curNode = curNode.next;
	}
}

function wrappedDefaultComparer<T>(a: T, b: T) {
	try {
		return defaultComparer(a, b);
	} catch (e) {
		if (e instanceof Error && /cannot compare/.test(e.message)) {
			throw new Error("For sorted lists with element types other than number or string, provide a custom comparer or implement Comparable<T> on the elements");
		} else {
			throw e;
		}
	}
}

/**
 * A list that automatically sorts its items to guarantee that they are always in order
 */
export class SortedList<T> {

	private first: SortedListNode<T>;
	private last: SortedListNode<T>;

	private _length: number = 0;
	public get length(): number {
		return this._length;
	}

	/**
	 * Creates a new empty sorted list
	 */
	constructor();
	/**
	 * Creates a new sorted list from the given items
	 * @param source Some items to initially add to the list
	 */
	constructor(source: Iterable<T>);
	/**
	 * Creates a new sorted list
	 * @param source Some items to initially add to the list or undefined to create an empty list
	 * @param comparer A comparer method used to sort items of a special
	 * type. Not necessary for numbers, strings and Comparable<T>
	 */
	constructor(source: Iterable<T> | undefined | null, comparer: Comparer<T>);

	constructor(
		source?: Iterable<T>,
		private readonly comparer: Comparer<T> = wrappedDefaultComparer,
	) {
		if (source != null) this.add(...source);
	}

	/** Inserts new items into the sorted list and returns the new length */
	public add(...items: T[]): number {
		for (const item of items) {
			this.addOne(item);
		}
		return this._length;
	}

	/** Adds a single item to the list */
	private addOne(item: T) {
		const newNode: SortedListNode<T> = {
			prev: null,
			next: null,
			value: item,
		};
		if (this._length === 0) {
			// add the first item
			this.first = this.last = newNode;
		} else {
			// add an item between two nodes
			const prevNode = findPrevNode(this.first, item, this.comparer);
			if (prevNode == null) {
				// the new node is the first one
				newNode.next = this.first;
				this.first = newNode;
			} else {
				if (prevNode.next != null) {
					prevNode.next.prev = newNode;
					newNode.next = prevNode.next;
				} else {
					this.last = newNode;
				}
				prevNode.next = newNode;
				newNode.prev = prevNode;
			}
		}
		this._length++;
	}

	/** Removes items from the sorted list and returns the new length */
	public remove(...items: T[]): number {
		for (const item of items) {
			this.removeOne(item);
		}
		return this._length;
	}

	/** Removes a single item from the list */
	private removeOne(item: T) {
		if (this._length === 0) return;

		const node = findNode(this.first, item, this.comparer);
		if (node != null) this.removeNode(node);
	}

	/** Removes the first item from the list and returns it */
	public shift(): T {
		if (this._length === 0) return;
		const node = this.first;
		this.removeNode(node);
		return node.value;
	}

	/** Returns the first item from the list without removing it */
	public peekStart(): T {
		return this.first && this.first.value;
	}

	/** Removes the last item from the list and returns it */
	public pop(): T {
		if (this._length === 0) return;
		const node = this.last;
		this.removeNode(node);
		return node.value;
	}

	/** Returns the last item from the list without removing it */
	public peekEnd(): T {
		return this.last && this.last.value;
	}

	/** Removes a specific node from the list */
	private removeNode(node: SortedListNode<T>) {
		// remove the node from the chain
		if (node.prev != null) {
			node.prev.next = node.next;
		} else {
			this.first = node.next;
		}
		if (node.next != null) {
			node.next.prev = node.prev;
		} else {
			this.last = node.prev;
		}
		this._length--;
	}

	/** Tests if the given item is contained in the list */
	public contains(item: T): boolean {
		return findNode(this.first, item, this.comparer) != null;
	}

	/** Removes all items from the list */
	public clear() {
		this.first = this.last = null;
		this._length = 0;
	}

	public *[Symbol.iterator]() {
		let curItem = this.first;
		while (curItem != null) {
			yield curItem.value;
			curItem = curItem.next;
		}
	}

	/** Flattens this list into an array */
	public toArray(): T[] {
		return [...this];
	}
}

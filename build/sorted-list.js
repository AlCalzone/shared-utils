"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comparable_1 = require("./comparable");
/**
 * Seeks the list from the beginning and finds the position to add the new item
 */
function findPrevNode(firstNode, item, comparer) {
    let ret;
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
function findNode(firstNode, item, comparer) {
    let curNode = firstNode;
    // while item > prevNode.value
    while (curNode != null) {
        if (comparer(curNode.value, item) === 0)
            return curNode;
        curNode = curNode.next;
    }
}
function wrappedDefaultComparer(a, b) {
    try {
        return comparable_1.defaultComparer(a, b);
    }
    catch (e) {
        if (e instanceof Error && /cannot compare/.test(e.message)) {
            throw new Error("For sorted lists with element types other than number or string, provide a custom comparer or implement Comparable<T> on the elements");
        }
        else {
            throw e;
        }
    }
}
/**
 * A list that automatically sorts its items to guarantee that they are always in order
 */
class SortedList {
    constructor(source, comparer = wrappedDefaultComparer) {
        this.comparer = comparer;
        this._length = 0;
        if (source != null)
            this.add(...source);
    }
    get length() {
        return this._length;
    }
    /** Inserts new items into the sorted list and returns the new length */
    add(...items) {
        for (const item of items) {
            this.addOne(item);
        }
        return this._length;
    }
    /** Adds a single item to the list */
    addOne(item) {
        const newNode = {
            prev: null,
            next: null,
            value: item,
        };
        if (this._length === 0) {
            // add the first item
            this.first = this.last = newNode;
        }
        else {
            // add an item between two nodes
            const prevNode = findPrevNode(this.first, item, this.comparer);
            if (prevNode == null) {
                // the new node is the first one
                newNode.next = this.first;
                this.first = newNode;
            }
            else {
                if (prevNode.next != null) {
                    prevNode.next.prev = newNode;
                    newNode.next = prevNode.next;
                }
                else {
                    this.last = newNode;
                }
                prevNode.next = newNode;
                newNode.prev = prevNode;
            }
        }
        this._length++;
    }
    /** Removes items from the sorted list and returns the new length */
    remove(...items) {
        for (const item of items) {
            this.removeOne(item);
        }
        return this._length;
    }
    /** Removes a single item from the list */
    removeOne(item) {
        if (this._length === 0)
            return;
        const node = findNode(this.first, item, this.comparer);
        if (node != null)
            this.removeNode(node);
    }
    /** Removes the first item from the list and returns it */
    shift() {
        if (this._length === 0)
            return;
        const node = this.first;
        this.removeNode(node);
        return node.value;
    }
    /** Removes the last item from the list and returns it */
    pop() {
        if (this._length === 0)
            return;
        const node = this.last;
        this.removeNode(node);
        return node.value;
    }
    /** Removes a specific node from the list */
    removeNode(node) {
        // remove the node from the chain
        if (node.prev != null) {
            node.prev.next = node.next;
        }
        else {
            this.first = node.next;
        }
        if (node.next != null) {
            node.next.prev = node.prev;
        }
        else {
            this.last = node.prev;
        }
        this._length--;
    }
    /** Tests if the given item is contained in the list */
    contains(item) {
        return findNode(this.first, item, this.comparer) != null;
    }
    /** Removes all items from the list */
    clear() {
        this.first = this.last = null;
        this._length = 0;
    }
    *[Symbol.iterator]() {
        let curItem = this.first;
        while (curItem != null) {
            yield curItem.value;
            curItem = curItem.next;
        }
    }
    /** Flattens this list into an array */
    toArray() {
        return [...this];
    }
}
exports.SortedList = SortedList;

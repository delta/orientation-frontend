class Node<T> {
	value!: T;
	next!: Node<T> | null;
	constructor(value: T, next: Node<T> | null = null) {
		this.value = value;
		this.next = next;
	}
}

/**
 * Basic native implementation of a queue,
 * with O(1) push and pop
 */
export class Queue<T> {
	head: Node<T> | null = null;
	tail: Node<T> | null = null;
	size = 0;
	// TODO: Make this a config
	private readonly MAX_SIZE = 5;
	constructor() {
		return;
	}
	/**
	 * Adds a new element to the end of the queue
	 */
	push(val: T) {
		const newNode = new Node(val);
		this.size += 1;
		if (this.head === null) {
			this.head = newNode;
			this.tail = newNode;
			return;
		}
		this.head.next = newNode;
		this.head = newNode;
		return;
	}

	/**
	 * Removes an element from the front of the queue, and returns it
	 */
	pop() {
		if (this.size === 0 || this.tail === null) return null;

		const val = this.tail.value;

		this.tail = this.tail.next;
		this.size--;

		return val;
	}

	isEmpty() {
		return this.size === 0;
	}

	getSize() {
		return this.size;
	}

	/**
	 * Tells if there is space for adding a new Node to the queue
	 */
	canAdd() {
		return this.size < this.MAX_SIZE;
	}

	isFull() {
		return this.size === this.MAX_SIZE;
	}
}

export {};

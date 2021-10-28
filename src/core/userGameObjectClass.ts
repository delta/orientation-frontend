import {
	BaseGameObject,
	GameObjectConstructorType,
} from "./baseGameObjectClass";
import { Queue } from "../utils/queue";

enum DirectionEnum {
	UP = 1,
	DOWN,
	LEFT,
	RIGHT,
}
interface PlayerGameObjectConstructorType extends GameObjectConstructorType {
	grid: number[][];

	x: number;
	y: number;
}

/**
 * A separate movement class for the direction a person has to move
 */
class PlayerMovement {
	direction!: DirectionEnum;
	constructor(direction: DirectionEnum) {
		this.direction = direction;
	}
}

export class PlayerGameObject extends BaseGameObject {
	grid!: number[][];

	x!: number;
	y!: number;

	cellWidth!: number;
	cellHeight!: number;

	// keyHeldDown = false;
	// used to check for key held down movement events
	isKeyBeingHeldDown = false;

	// Arbitrary number included to add data to the movement queue
	private readonly KEY_HOLD_DOWN_TIMEOUT = 400;

	// Since movement is not instantaneous
	// we push keyboard events to a queue and the
	// the movement is pop-ed for the queue after it takes place
	movementQueue = new Queue<PlayerMovement>();

	constructor(data: PlayerGameObjectConstructorType) {
		super(data);
		this.grid = data.grid;

		this.x = data.x;
		this.y = data.y;

		this.cellHeight = this.width / this.grid.length;
		this.cellWidth = this.height / this.grid[0].length;
	}

	/**
	 * adds listener for different directions
	 * and calls registerMovement for different directions
	 */
	listenForPlayerMovement(e: KeyboardEvent) {
		switch (e.key) {
			case "ArrowLeft":
				// Left pressed
				this.registerMovement(DirectionEnum.LEFT, e.repeat);
				break;
			case "ArrowRight":
				// Right pressed
				this.registerMovement(DirectionEnum.RIGHT, e.repeat);
				break;
			case "ArrowUp":
				// Up pressed
				this.registerMovement(DirectionEnum.UP, e.repeat);
				break;
			case "ArrowDown":
				// Down pressed
				this.registerMovement(DirectionEnum.DOWN, e.repeat);
				break;
		}
	}

	/**
	 * registers a movement to pushes it to a movement queue
	 *
	 * this function is only responsible for adding the movement to a queue,
	 * It does not check for collisions,
	 *
	 * The only things its responsible for are
	 * 1. Check if the movement queue is full
	 * 2. Handle case for if the keyIsHeldDown
	 *
	 *
	 */
	registerMovement(dir: DirectionEnum, isKeyHeldDown: boolean) {
		if (!this.movementQueue.canAdd()) {
			// the movement queue is full, we cannot add a new
			// element to the queue, just return
			return;
		}
		// key held down event fires multiple times per second
		//
		// when the user first invokes keyHeldDown event, we push that event to queue
		// and start a timeout, and the next keydown event will only be invoked after
		// the timeout is over
		if (isKeyHeldDown === true) {
			if (this.isKeyBeingHeldDown) {
				// timeout is still running, we do not consider this events
				return;
			}

			this.movementQueue.push(new PlayerMovement(dir));
			this.isKeyBeingHeldDown = true;
			this.keyDownResetCountDown();
		} else {
			this.movementQueue.push(new PlayerMovement(dir));
		}
	}

	/**
	 * A timer to limit the no. of times we count a keyDown event as a movement
	 *
	 * This is done to ensure, we dont make a movement for every key hold event ( which fires multiple times
	 * per second if the user holds the movement key )
	 */
	keyDownResetCountDown() {
		setTimeout(
			() => (this.isKeyBeingHeldDown = false),
			this.KEY_HOLD_DOWN_TIMEOUT
		);
	}

	/**
	 * Gets the current cell the user is in, and checks
	 * if the user can move to the specified block
	 */
	checkCollision(dir: DirectionEnum) {
		const cellX = Math.floor(this.x / this.cellWidth);
		const cellY = Math.floor(this.y / this.cellHeight);

		if (cellY >= this.grid.length || cellX >= this.grid[0].length) {
			// this should not happen
			//
			// Adding a case to make sure this doesn't throw any error
			return true;
			// if the user goes out of the map, we just do not let him move
		}

		let doesCollide = false;
		switch (dir) {
			case DirectionEnum.UP:
				doesCollide = this.grid[cellX][cellY - 1] === 1;
				break;
			case DirectionEnum.DOWN:
				doesCollide = this.grid[cellX][cellY + 1] === 1;
				break;
			case DirectionEnum.LEFT:
				doesCollide = this.grid[cellX - 1][cellY] === 1;
				break;
			case DirectionEnum.RIGHT:
				doesCollide = this.grid[cellX + 1][cellY] === 1;
				break;
		}

		return doesCollide;
	}
}

export {};

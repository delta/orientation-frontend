import {
	BaseGameObject,
	GameObjectConstructorType,
} from "./baseGameObjectClass";
import { Queue } from "../utils/queue";

enum DirectionEnum {
	UP,
	DOWN,
	LEFT,
	RIGHT,
}
interface PlayerGameObjectConstructorType extends GameObjectConstructorType {
	grid: number[][];
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

	// check collision and move to the next square
	checkCollision() {}
}

export {};

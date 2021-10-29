import {
	BaseGameObject,
	GameObjectConstructorType,
} from "./baseGameObjectClass";
import { Queue } from "../utils/queue";
import { Dispatch, SetStateAction } from "react";
import { UserPosition } from "../components/game/sceneManager";
import { config } from "../config/config";

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

	userPositionDispatcher: Dispatch<SetStateAction<UserPosition>>;
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

	/**
	 * A Dispatch event to set the user state in scene manager
	 */
	userPositionDispatcher!: Dispatch<SetStateAction<UserPosition>>;

	// keyHeldDown = false;
	// used to check for key held down movement events
	isKeyBeingHeldDown = false;

	// Arbitrary number included to add data to the movement queue
	private readonly KEY_HOLD_DOWN_TIMEOUT =
		config.userGameObjectConfig.KEY_HOLD_DOWN_TIMEOUT;

	// Since movement is not instantaneous
	// we push keyboard events to a queue and the
	// the movement is pop-ed for the queue after it takes place
	movementQueue = new Queue<PlayerMovement>();

	isPlayerMoving = false;
	// the direction the player is facing
	playDirection = DirectionEnum.RIGHT;

	// a timer to determine how long it takes for the user to change their direction
	private readonly PLAYER_DIRECTION_CHANGER_TIMEOUT =
		config.userGameObjectConfig.PLAYER_DIRECTION_CHANGER_TIMEOUT;

	/**
	 * no of steps the player has to take to move to the next cell
	 */
	private readonly PLAYER_STEPS_TO_NEXT_BLOCK =
		config.userGameObjectConfig.PLAYER_STEPS_TO_NEXT_BLOCK;
	// keeping it a high val, so movement feels organic
	// Note: Try keeping it a non prime number, for prevent rounding off errors

	// distance travelled by a user during a single step
	private PLAYER_STEP_DISTANCE_X_AXIS!: number;
	private PLAYER_STEP_DISTANCE_Y_AXIS!: number;

	/**
	 * time taken for a user to complete a step
	 */
	private readonly PLAYER_STEP_TIME =
		config.userGameObjectConfig.PLAYER_STEP_TIME;
	// IDEALLY ==>> a movement from to an adjacent block should take ~800ms, and ALWAYS < 1200

	constructor(data: PlayerGameObjectConstructorType) {
		super(data);
		this.grid = data.grid;

		this.x = data.x;
		this.y = data.y;

		this.cellHeight = this.width / this.grid.length;
		this.cellWidth = this.height / this.grid[0].length;

		this.PLAYER_STEP_DISTANCE_X_AXIS =
			this.cellWidth / this.PLAYER_STEPS_TO_NEXT_BLOCK;
		this.PLAYER_STEP_DISTANCE_Y_AXIS =
			this.cellHeight / this.PLAYER_STEPS_TO_NEXT_BLOCK;
	}

	/**
	 * All the brains and logic behind the movement GameObject
	 *
	 * pops an a movement request from the queue
	 * checks for collision and moves the player to the required block
	 *
	 * after moving he player, it pops the next element from the queue, until
	 * the queue is empty
	 */
	async movePlayer(): Promise<void> {
		this.isPlayerMoving = true;

		const nextMove = this.movementQueue.pop();
		if (!nextMove) {
			// the queue is empty
			return;
		}

		const canMove = this.checkCollision(nextMove.direction);

		await this.changeDirection(nextMove.direction);

		const stepDistance =
			nextMove.direction === DirectionEnum.UP ||
			nextMove.direction === DirectionEnum.DOWN
				? this.PLAYER_STEP_DISTANCE_Y_AXIS
				: this.PLAYER_STEP_DISTANCE_X_AXIS;

		if (canMove) await this.moveOneBlock(nextMove.direction, stepDistance);
		else await this.pseudoMoveBlock(nextMove.direction);

		// if the queue is empty, stop the movement
		// else call movePlayer again
		if (this.movementQueue.isEmpty()) {
			this.isPlayerMoving = false;
			return;
		}
		// it will be called recursively until the queue is empty
		return await this.movePlayer();
	}

	/**
	 * Moves the user 1 block in the given direction
	 *
	 * this function takes care updating the user position in sceneManager,
	 * and updating sprites. Only collision needs to be checked before calling this
	 * function
	 */
	async moveOneBlock(dir: DirectionEnum, stepDistance: number) {
		let ctr = 0;
		this.changeSprite("Moving user 1 block in " + dir);
		await new Promise<void>((resolve) => {
			let xStep = 0,
				yStep = 0;
			if (dir === DirectionEnum.UP) yStep = -stepDistance;
			else if (dir === DirectionEnum.DOWN) yStep = stepDistance;
			else if (dir === DirectionEnum.LEFT) xStep = -stepDistance;
			else xStep = stepDistance;

			const timer = setInterval(() => {
				ctr++;
				this.moveSingleStep(this.x + xStep, this.y + yStep);

				// if we have many sprites, we can create
				// change sprite when ctr is odd or even ...

				if (ctr === this.PLAYER_STEPS_TO_NEXT_BLOCK) {
					clearInterval(timer);
					// after the interval is cleared the function will finish running,
					// it won't just terminate
					resolve();
				}
			}, this.PLAYER_STEP_TIME);
		});
		this.changeSprite("Moved user 1 block in " + dir + "direction");
	}

	/**
	 * Just creates an illusion of the player moving,
	 * (aka player has movement animation in the same block)
	 */
	async pseudoMoveBlock(_dir: DirectionEnum) {
		// the user cannot move to the next block,
		// we change direction and show moving animation (call it "moonwalk")
		// for the walk duration and complete the movement
		this.changeSprite("moonwalk start");

		// rn the moonwalk animation cannot be paused
		// but generally in games, the movement animation stops
		// and the user starts moving in the required direction,
		// if another valid (moveable) key press is done
		//
		// we can implement it if time suffices
		await new Promise((resolve) =>
			setTimeout(
				resolve,
				this.PLAYER_STEP_TIME * this.PLAYER_STEPS_TO_NEXT_BLOCK
			)
		);

		this.changeSprite("moonwalk ends");
	}

	/**
	 * Moves the user to the specified (x,y) co-ordinate and updates the user
	 * position in SceneManager with event dispatcher
	 *
	 * A single point of control for all position changes
	 */
	moveSingleStep(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.userPositionDispatcher({ x, y });
	}

	/**
	 * returns a promise which resolves after the directionChanges
	 */
	changeDirection(dir: DirectionEnum) {
		return new Promise<void>((resolve, _reject) => {
			// if the user is facing the right direction we resolve immediately
			if (dir === this.playDirection) resolve();
			setTimeout(() => {
				// TODO: we currently do not have any user sprites
				// need to add them here for changing direction
				this.playDirection = dir;
				resolve();
			}, this.PLAYER_DIRECTION_CHANGER_TIMEOUT);
		});
	}

	/**
	 * Changes the sprite to the given sprite
	 *
	 * Making it a separate func to  have a single point of control
	 * for changing the image being rendered
	 */
	changeSprite(data: any) {
		// still have not figured what to do with sprite placeholder lol
		console.log("changing sprite to : ", data);
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
	 * registers a movement and pushes it to a movement queue
	 *
	 * this function is only responsible for adding the movement to a queue,
	 * It does not check for collisions,
	 *
	 * The only things its responsible for are
	 * 1. Check if the movement queue is full
	 * 2. Handle case for if the keyIsHeldDown
	 * 3. Call movePlayer method if it isn't already running
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
			this.keyDownResetCountDown();
		} else {
			this.movementQueue.push(new PlayerMovement(dir));
		}
		if (!this.isPlayerMoving) this.movePlayer();
	}

	/**
	 * A timer to limit the no. of times we count a keyDown event as a movement
	 *
	 * This is done to ensure, we dont make a movement for every key hold event ( which fires multiple times
	 * per second if the user holds the movement key )
	 */
	keyDownResetCountDown() {
		this.isKeyBeingHeldDown = true;
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
			// this should not happen man tf
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

// This file is responsible for all the rendering related logic the the
// user-object canvas
//

export interface IGameObjectRenderConstructor {
	x: number;
	y: number;
	width: number;
	height: number;
	src: HTMLImageElement;
	audio?: HTMLAudioElement;
	animationDuration: number;
	animator: () => void;
}

/**
 * This is a individual GameObject which has to be rendered
 * Any sprite which has to be rendered on the screen, has to be part of this
 */
export class GameObjectRender {
	// starting co-ordinates
	x!: number;
	y!: number;
	// height and width of the element
	width!: number;
	height!: number;
	// src of the element which has to be render-ed
	// TODO: add support for SVG Rendering (Path2D)
	src!: HTMLImageElement;
	// Audio sound cue if present (How to conditionally display audio on certain events ?)
	audio?: HTMLAudioElement;
	isAudioCue = false; // tells if this Object has a audio cue or not

	// animator function runs periodically which
	// causes an animation like effect;
	//
	// right now if the user wants to update the animator function,
	// he has to call the setAnimator method which will
	// end the current animation frame and the update the new animation,
	// and run it with setInterval
	// TODO: add necessary utility type / access modifier to prevent user manipulation
	// HACK: If the element has no animation, pass it an empty function for animator
	private animator!: () => void;
	animatorKey!: NodeJS.Timeout; // keys uses to end the setInterval;

	constructor(data: IGameObjectRenderConstructor) {
		this.x = data.x;
		this.width = data.width;
		this.y = data.y;
		this.height = data.height;
		this.src = data.src;

		if (data.audio) {
			this.audio = data.audio;
			this.isAudioCue = true;
		}

		// saving it coz, its easier to understand / we might need it later
		this.animator = data.animator;

		this.animatorKey = setInterval(this.animator, data.animationDuration);
	}

	/**
	 * end the old animator function and re-initialize it to a new one
	 */
	setAnimator({
		animator,
		interval,
	}: {
		animator: () => void;
		interval: number;
	}): void {
		clearInterval(this.animatorKey);
		this.animator = animator;
		this.animatorKey = setInterval(this.animator, interval);
		return;
	}

	/**
	 * this function is responsible for rendering the given game element.
	 * It will be called by the game engine renderer for every request animation frame
	 * This function should not be modified !!
	 */
	render(ctx: CanvasRenderingContext2D) {
		// using fillRect rn because I dont have any sprites : (
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

/**
 * this class takes care of all the logic pertaining to rendering all game objects
 * and using requestAnimationFrame to re-render the canvas etc
 *
 * Any Spite / Image which you want to render in the canvas must added / edit to this class's renderingList via
 * appropriate methods. But once added to the renderingList, a item cannot be removed from it.
 *
 */
export class Renderer {
	// mapObject contains every object which needs to be rendered in
	// the canvas. On every requestAnimation frame, the render method of each mapObject
	// will be called, to make the re-render.
	// The animation effect is independent of the the Render class,
	// that is taken care in GameObjectRender class
	//
	// !! Note: Once a gameObjectRender is added to the mapObject, it should not be removed,
	// to enforce this rule, the mapObjects property is private
	private mapObjects = Array<GameObjectRender>();
	canvas!: HTMLCanvasElement;
	ctx!: CanvasRenderingContext2D;
	// canvas dimensions
	width!: number;
	height!: number;
	// shd re-render again
	// (aka use requestAnimationFrame to re-pain the canvas / the canvas wont change)
	shouldRender = true;

	constructor({ canvas }: { canvas: HTMLCanvasElement | null }) {
		this.canvas = canvas as HTMLCanvasElement;
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
		this.height = this.canvas.height;
		this.width = this.canvas.width;
	}

	/**
	 * Adds the given GameObjectRender to the rendering array, and returns its index.
	 * Once a GameObject is added to rendering array, it cannot be removed. This is
	 * done to ensure efficient get() and avoid null renders.
	 *
	 *
	 * The returned index must be used to access the gameObjectRender later, if you
	 * want to edit it.
	 */
	add(data: GameObjectRender) {
		this.mapObjects.push(data);
		return this.mapObjects.length - 1;
	}

	/**
	 * Finds and returns the gameObjectRender with the given index.
	 * The user is guaranteed to get the GameObjectRender in O(1)
	 */
	get(index: number) {
		if (index >= this.mapObjects.length) throw "index out of bounds.";
		return this.mapObjects[index];
	}

	draw() {
		if (!this.shouldRender) return;
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.mapObjects.forEach((m) => m.render(this.ctx));
		requestAnimationFrame(this.draw);
	}

	endAnimation() {
		// BUG: Animation setInterval will continue to run, which might hinder performance
		// we need to figure out some logic to stop the animation and resume it when the
		// user continues the animation. Rn there will be a big shift when the user
		// stops and resumes animation
		this.shouldRender = false;
		return;
	}

	restartAnimation() {
		this.shouldRender = true;
		this.draw();
	}
}

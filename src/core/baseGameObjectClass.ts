import { GameMap } from "./MapObject";

export interface GameObjectConstructorType {
	canvas: HTMLCanvasElement | null;
	obj: GameMap;
	audio?: HTMLAudioElement;
}

export interface BaseGameObjectProps {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	audio?: HTMLAudioElement;
}

/**
 * Base Class of all Game Objects
 */
export class BaseGameObject {
	private canvas!: HTMLCanvasElement;
	protected ctx!: CanvasRenderingContext2D;
	src!: HTMLImageElement;

	width!: number;
	height!: number;

	audio?: HTMLAudioElement;
	isAudio = false;
	// ctx: number
	constructor({ canvas, obj, audio }: GameObjectConstructorType) {
		this.canvas = canvas as HTMLCanvasElement;
		this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
		this.src = obj.imageObject as HTMLImageElement;
		this.width = obj.width;
		this.height = obj.height;
		this.audio = audio;
		// check if an audio is present
		this.isAudio = !!audio;
	}

	// renders the object with given dimensions
	paintObject(x: number, y: number) {
		this.ctx.drawImage(this.src, x, y, this.width, this.height);
	}
}

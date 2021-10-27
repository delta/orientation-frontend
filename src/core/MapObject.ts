const MAP_ZOOM = 1;

export interface GameMapConstructorType {
	zoom: number;
	startX: number;
	startY: number;
	height: number;
	width: number;
	grid: number[][];
	imageObject: HTMLImageElement | null;
}

export class GameMap {
	zoom = MAP_ZOOM;
	startX = 0;
	startY = 0;
	height = 400;
	width = 400;
	grid = new Array(Array<number>()); // fuck typescript
	imageObject!: HTMLImageElement | null;
	constructor({
		height,
		width,
		imageObject,
		startX,
		startY,
		grid,
	}: GameMapConstructorType) {
		this.height = height;
		this.width = width;
		this.startX = startX;
		this.startY = startY;
		this.grid = grid;

		if (imageObject == null) console.error("Image not loaded properly");

		this.imageObject = imageObject;
	}
}

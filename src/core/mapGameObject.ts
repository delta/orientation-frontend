import { BaseGameObject, GameObjectConstructorType } from "./baseGameObject";

interface MapGameObjectConstructorType extends GameObjectConstructorType {
	grid: number[][];
}

export class MapGameObject extends BaseGameObject {
	grid!: number[][];
	constructor(data: MapGameObjectConstructorType) {
		super(data);
		this.grid = data.grid;
		this.height = (data.canvas as HTMLCanvasElement).height;
		this.width = (data.canvas as HTMLCanvasElement).width;
	}
}

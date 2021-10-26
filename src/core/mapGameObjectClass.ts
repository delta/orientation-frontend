import {
	BaseGameObject,
	GameObjectConstructorType,
} from "./baseGameObjectClass";

interface MapGameObjectConstructorType extends GameObjectConstructorType {
	grid: number[][];
}

export class MapGameObject extends BaseGameObject {
	// Possible refactor: we are doing collision detection only in
	// player game object, so grid might be not be needed in this class
	grid!: number[][];
	constructor(data: MapGameObjectConstructorType) {
		super(data);
		this.grid = data.grid;
		this.height = (data.canvas as HTMLCanvasElement).height;
		this.width = (data.canvas as HTMLCanvasElement).width;
	}
}

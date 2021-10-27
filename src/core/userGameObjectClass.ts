import {
	BaseGameObject,
	GameObjectConstructorType,
} from "./baseGameObjectClass";

interface PlayerGameObjectConstructorType extends GameObjectConstructorType {
	grid: number[][];
}

export class PlayerGameObject extends BaseGameObject {
	grid!: number[][];

	cellWidth!: number;
	cellHeight!: number;

	constructor(data: PlayerGameObjectConstructorType) {
		super(data);
		this.grid = data.grid;

		this.cellHeight = this.width / this.grid.length;
		this.cellWidth = this.height / this.grid[0].length;
	}

	// check collision and move to the next square
}

export {};

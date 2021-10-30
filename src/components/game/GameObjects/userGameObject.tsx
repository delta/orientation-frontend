import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useContext,
} from "react";
import { UserPosition } from "../sceneManager";
import { UserCanvasContext, MapContext } from "../../../contexts";
import {
	PlayerGameObject,
	PlayerGameObjectConstructorType,
} from "../../../core/userGameObjectClass";
import { GameObjectRender } from "../../../core/render";
import { mapData } from "../../../data/map";
import { GameMap } from "../../../core/MapObject";
interface Props {
	userPosition: UserPosition;
	setUserPosition: (
		position: UserPosition,
		renderingGameObjectIndex: number
	) => void;
	addUserToRenderer: (data: GameObjectRender) => number;
}

/**
 * This component is responsible for all the user game object related logic
 * We have to find a efficient way to re-render the user data
 */

const UserGameObject = (props: Props) => {
	const userCanvas = useContext(UserCanvasContext);
	const mapContextArray = useContext(MapContext);
	const memo = useMemo(() => {
		return new PlayerGameObject({
			canvas: userCanvas as HTMLCanvasElement,
			grid: mapData[0].grid,
			x: props.userPosition.x,
			y: props.userPosition.y,
			userPositionUpdater: props.setUserPosition,
			obj: (mapContextArray as GameMap[])[0],
			addUserToRenderer: props.addUserToRenderer,
		});
	}, []);

	useEffect(() => {
		window.addEventListener("keydown", (e) => {
			memo.listenForPlayerMovement(e);
		});
		// return window.removeEventListener("keydown", (e) => {
		// 	console.log(e.key);
		// 	memo.listenForPlayerMovement(e);
		// });
	}, []);
	return <></>;
};

export { UserGameObject };

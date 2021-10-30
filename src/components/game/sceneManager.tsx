import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapGameObject } from "./GameObjects/mapGameObject";
import { UserGameObject } from "./GameObjects/userGameObject";

import { UserCanvasContext } from "../../contexts";

import { GameObjectRender, Renderer } from "../../core/render";
interface SceneManagerProps {
	children?: React.ReactNode;
}

export interface UserPosition {
	x: number;
	y: number;
}

/**
 * Scene Manager is the control center of the game
 * it controls where the player is and and passes all the data to its child components
 *
 * Its responsible for communicating with the server
 * Every communication to the server must be done here, its children (aka all the GameObjects),
 * are only responsible for rendering their data.
 *
 * User Position is set only here and set to the GameObject as props, Only the UserGameObject
 * wil be able to change the user position. others GameObjects can only read them
 */

const InitCanvas = (canvas: HTMLCanvasElement) => {
	return canvas.getContext("2d") as CanvasRenderingContext2D;
};

const SceneManager: React.FC<SceneManagerProps> = ({ children }) => {
	const [userPosition, setUserPosition] = useState<UserPosition>({
		x: 0,
		y: 0,
	});

	const userCanvas = useContext(UserCanvasContext) as HTMLCanvasElement;

	// the scene the user is in
	const [scene, _setScene] = useState(1);

	const [ctx, _setCtx] = useState(InitCanvas(userCanvas));

	// const render = () => {
	// 	console.log("x : ", userPosition.x, ", y : ", userPosition.y);
	// 	ctx.clearRect(0, 0, 1000, 700);
	// 	ctx.fillRect(userPosition.x - 40, userPosition.y - 40, 40, 40);
	// 	// requestAnimationFrame(render);
	// };

	useEffect(() => {
		// TODO: integrate with server
		// we contact the server and get the user's current position / state
		// and set it here.
		//
		// We also need to check if the the user is active in another websocket connection
		// if he is active, we have to show some error message saying he can only play the game in 1 tab
		// render();
		gameRenderer.draw();
	}, []);

	const gameRenderer = useMemo(() => {
		// we create a new instance of Render Class for every scene
		return new Renderer({ canvas: userCanvas });
	}, [scene]);

	const updateUserPosition = (
		position: UserPosition,
		renderingGameObjectIndex: number
	) => {
		setUserPosition(position);

		const gameObject = gameRenderer.get(renderingGameObjectIndex);
		// we update the position manually, instead of using
		// setAnimation method of GameObjectRender
		gameObject.x = position.x;
		gameObject.y = position.y;
	};

	const addObjectToRenderer = (data: GameObjectRender) => {
		console.log("adding data to the renderer", data);
		// return 0;
		return gameRenderer.add(data);
	};

	return (
		<>
			<MapGameObject userPosition={userPosition} />
			<UserGameObject
				userPosition={userPosition}
				setUserPosition={updateUserPosition}
				addUserToRenderer={addObjectToRenderer}
			/>
			<button
				className="p-4 bg-green-600 rounded-lg font-bold text-white mt-5 hover:bg-gray-600"
				onClick={() => console.log(gameRenderer)}
			>
				Button
			</button>
		</>
	);
};

export { SceneManager };

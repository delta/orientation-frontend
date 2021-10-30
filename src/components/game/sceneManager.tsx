import React, { useContext, useEffect, useState } from "react";
import { MapGameObject } from "./GameObjects/mapGameObject";
import { UserGameObject } from "./GameObjects/userGameObject";

import { UserCanvasContext } from "../../contexts";

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

	const [ctx, _setCtx] = useState(InitCanvas(userCanvas));

	const render = () => {
		console.log("x : ", userPosition.x, ", y : ", userPosition.y);
		ctx.clearRect(0, 0, 1000, 700);
		ctx.fillRect(userPosition.x - 40, userPosition.y - 40, 40, 40);
		// requestAnimationFrame(render);
	};

	useEffect(() => {
		// TODO: integrate with server
		// we contact the server and get the user's current position / state
		// and set it here.
		//
		// We also need to check if the the user is active in another websocket connection
		// if he is active, we have to show some error message saying he can only play the game in 1 tab
		render();
	}, []);

	return (
		<>
			<MapGameObject userPosition={userPosition} />
			<UserGameObject
				userPosition={userPosition}
				setUserPosition={setUserPosition}
			/>
			<button
				className="p-4 bg-green-600 rounded-lg font-bold text-white mt-5 hover:bg-gray-600"
				onClick={render}
			>
				Button
			</button>
		</>
	);
};

export { SceneManager };

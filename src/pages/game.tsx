import React, { useRef } from "react";
import { MapCanvasContext } from "../contexts";
import { AssetLoader, SceneManager } from "../components/game";

// Contains all the UI and styling for the game
const GamePage = () => {
	const mapCanvas = useRef<null | HTMLCanvasElement>(null);
	return (
		<>
			<div className="h-auto w-min bg-white mx-auto ">
				<canvas
					ref={mapCanvas}
					width={1000}
					height={700}
					className="border-2 border-blue-400 mt-14"
				/>
				{/* rn the the width and height are hard coded. Ideally this needs to be
				be a portion of the screen (say 80%). And prolly do not need to 
				resize it, when the screen size changes, coz it will cause unnecessary
				rerenders and complications.*/}
			</div>
			<MapCanvasContext.Provider value={mapCanvas.current}>
				<AssetLoader>
					<SceneManager />
				</AssetLoader>
			</MapCanvasContext.Provider>
		</>
	);
};

export { GamePage };

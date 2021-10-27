import React, { useRef, useState, useEffect } from "react";
import { MapCanvasContext, UserCanvasContext } from "../contexts";
import { AssetLoader, SceneManager } from "../components/game";

// Contains all the UI and styling for the game
const GamePage = () => {
	const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement | null>(null);
	const [userCanvas, setUserCanvas] = useState<HTMLCanvasElement | null>(null);
	useEffect(() => {
		console.log("map canvas", mapCanvas);
	});
	return (
		<>
			<div className="h-auto w-min bg-white mx-auto ">
				<canvas
					ref={setMapCanvas}
					width={1000}
					height={700}
					className="border-2 border-blue-400 mt-14 z-0"
				/>
				<canvas width={1000} height={700} ref={setUserCanvas} />
				{/* rn the the width and height are hard coded. Ideally this needs to be
				be a portion of the screen (say 80%). And prolly do not need to 
				resize it, when the screen size changes, coz it will cause unnecessary
				rerenders and complications.*/}
			</div>
			<MapCanvasContext.Provider value={mapCanvas}>
				<UserCanvasContext.Provider value={userCanvas}>
					<AssetLoader>
						<SceneManager />
					</AssetLoader>
				</UserCanvasContext.Provider>
			</MapCanvasContext.Provider>
		</>
	);
};

export { GamePage };

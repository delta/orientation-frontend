import React, { useRef, useState, useEffect } from "react";
import { MapCanvasContext } from "../contexts";
import { AssetLoader, SceneManager } from "../components/game";

const MapCanvasContextWrapper: React.FC<{
	map: HTMLCanvasElement | null;
}> = ({ map, children }) => {
	console.log("CONTEXT CURRENT :  ", map);
	return (
		<MapCanvasContext.Provider value={map}>
			{children}
		</MapCanvasContext.Provider>
	);
};

// Contains all the UI and styling for the game
const GamePage = () => {
	const [mapCanvas, setMapCanvas] = useState<HTMLCanvasElement | null>(null);
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
					className="border-2 border-blue-400 mt-14"
				></canvas>
				{/* rn the the width and height are hard coded. Ideally this needs to be
				be a portion of the screen (say 80%). And prolly do not need to 
				resize it, when the screen size changes, coz it will cause unnecessary
				rerenders and complications.*/}
			</div>
			<MapCanvasContextWrapper map={mapCanvas}>
				<AssetLoader>
					<SceneManager />
				</AssetLoader>
			</MapCanvasContextWrapper>
		</>
	);
};

export { GamePage };

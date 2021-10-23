import React, { useRef, useEffect } from "react";
import { MapCanvasContext } from "../contexts";
import { AssetLoader, SceneManager } from "../components/game";

const MapCanvasContextWrapper: React.FC<{
	map: React.MutableRefObject<HTMLCanvasElement | null>;
}> = ({ map, children }) => {
	console.log("CONTEXT CURRENT :  ", map);
	return (
		<MapCanvasContext.Provider value={map.current}>
			{children}
		</MapCanvasContext.Provider>
	);
};

// Contains all the UI and styling for the game
const GamePage = () => {
	const mapCanvas = useRef<null | HTMLCanvasElement>(null);
	useEffect(() => {
		console.log("map canvas", mapCanvas.current);
	});
	return (
		<>
			<div className="h-auto w-min bg-white mx-auto ">
				<canvas
					ref={mapCanvas}
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

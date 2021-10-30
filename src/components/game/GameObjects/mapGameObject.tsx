import React, { useContext, useEffect, useRef } from "react";
import { UserPosition } from "../sceneManager";
import { MapCanvasContext, MapContext } from "../../../contexts";
import { MapGameObject as MapGame } from "../../../core/mapGameObjectClass";

interface Props {
	userPosition: UserPosition;
}

// this component will be rerendered every time the user position changes.
// So we will be repainting an image every time the user moves.
// this might lead to potential bottle necks and performance issues
//
// The fix might very depending on the the type of map we are gonna use.
// Dynamically lazy loading map / Have different scenes for the the same map.
// This function needs to be refactored and reviewed for potential bottle-necks once these
// details have been finalized.
export const MapGameObject = ({ userPosition }: Props) => {
	const mapCanvas = useContext(MapCanvasContext);
	const mapContextArray = useContext(MapContext);
	const mapRef = useRef<MapGame | null>(null);
	useEffect(() => {
		// console.log("mapRef :", mapCanvas);
		if (!mapContextArray) return;
		const mapContext = mapContextArray[0];
		if (!mapCanvas || !mapContext) return;
		const map = new MapGame({
			canvas: mapCanvas,
			grid: mapContext.grid,
			obj: mapContext,
		});
		// console.log(map);
		map.paintObject(0, 0);
		mapRef.current = map;
	}, []);

	return <></>;
};

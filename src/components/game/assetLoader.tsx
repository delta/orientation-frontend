import React, { useState, useEffect } from "react";
import { loadAsset, AssetType } from "../../core/assetLoader";
import { mapData } from "../../data/map";
import { GameMap } from "../../core/MapObject";
import { MapContext } from "../../contexts";

interface AssetLoaderProps {
	children?: React.ReactNode;
}

interface MapContextProviderProps {
	children?: React.ReactNode;
	gameMapObject: GameMap[] | null;
}

/**
 * pass an array of req Data Obj, and the caller is guaranteed to get a promise returning an
 * array of all the assets passed as a HTML Elements.
 */
const fetchAssetData = (reqMapData: typeof mapData) => {
	return new Promise<AssetType[]>((resolve, reject) => {
		const promiseArray: Promise<AssetType>[] = [];
		reqMapData.forEach((singleMapData) =>
			promiseArray.push(loadAsset(singleMapData.source))
		);
		Promise.all(promiseArray)
			.then((data) => resolve(data))
			.catch((err) => {
				console.error("couldn't load the data, " + err);
				reject();
			});
	});
};

/**
 * generating map data
 *
 * @returns an array of given asset data
 * TODO: Make it lazy load the other map segments
 *
 */
const createDataObjects = async () => {
	// TODO: Make it lazy load the other map segments
	// implement something similar to Intersection Observe API for canvas
	// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
	//

	try {
		const mapElements = await fetchAssetData(mapData);
		const mapObjects = mapData.map((m, index) => {
			return new GameMap({ ...m, imageObject: mapElements[index], zoom: 1 });
		});

		return { mapObjects };
	} catch (err) {
		console.error(err);
		throw err;
	}
};

/**
 * a context wrapper for map context
 */
const MapContextProvider: React.FC<MapContextProviderProps> = ({
	children,
	gameMapObject,
}) => {
	return (
		<MapContext.Provider value={gameMapObject}>{children}</MapContext.Provider>
	);
};

/**
 * This the component responsible for the fetching asset data, and loading them into context.
 * Whenever we load any asset data, it shd be fetched here and put into a context.
 * Right now, there isn't any lazy loading. We have to figure out a way to identify the absolutely
 * necessary data and the data which can be lazy loaded and fetch them appropriately.
 *
 * The map data is present in the  MapContext and player sprite (todo) in the SpriteContext
 *
 */
const AssetLoader: React.FC<AssetLoaderProps> = ({ children }) => {
	// loads all assets and puts them into a
	const [loading, isLoading] = useState(true);
	const [gameMapObject, setGameMapObject] = useState<GameMap[] | null>(null);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		(async () => {
			try {
				const { mapObjects } = await createDataObjects();
				setGameMapObject(mapObjects);
				isLoading(false);
			} catch (err) {
				setError(err);
			}
		})();
	}, []);

	return loading ? (
		// TODO: Add a loading icon / animation
		<>loading...</>
	) : (
		<>
			<MapContextProvider gameMapObject={gameMapObject}>
				{children}
			</MapContextProvider>
		</>
	);
};

export { AssetLoader };

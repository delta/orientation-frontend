import React, { useContext, useState } from "react";
import { loadAsset, AssetType } from "../../core/mapAssetLoader";
import { mapData } from "../../data/map";
import { GameMap, GameMapProps } from "../../core/MapObject";

interface Props {
	children?: React.ReactNode;
}

/**
 * pass an array of req Data Obj, and the caller is guaranteed to get a promise returning an
 * array of all the assets passed as a HTML Element.
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

const createDataObjects = async () => {
	// generating map data
	//
	// returns an array of given asset data
	// TODO: Make it lazy load the other map segments
	// implement something similar to Intersection Observe API for canvas
	// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
	//
	//

	try {
		const mapElements = await fetchAssetData(mapData);
		const mapObjects = mapData.map((m, index) => {
			return new GameMap({ ...m, imageObject: mapElements[index], zoom: 1 });
		});

		return { mapObjects };
	} catch (err) {
		console.error(err);
	}
};

const AssetLoader = ({}: Props) => {
	// loads all assets and creates puts them into a
	// context
	const [loading, isLoading] = useState(true);

	return loading ? <>loading...</> : <></>;
};

export { AssetLoader };

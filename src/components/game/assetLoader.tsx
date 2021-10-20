import React, { useContext, useState } from "react";
import { loadAsset, AssetType } from "../../core/mapAssetLoader";
import { mapData } from "../../data/map";
interface Props {
	children?: React.ReactNode;
}

const fetchAllData = () => {
	return new Promise<AssetType[]>((resolve, reject) => {
		const promiseArray: Promise<AssetType>[] = [];
		mapData.forEach((singleMapData) =>
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

const AssetLoader = ({}: Props) => {
	// loads all assets and creates puts them into a
	// context
	const [loading, isLoading] = useState(true);

	return loading ? <>loading...</> : <></>;
};

export { AssetLoader };

const createRegExp = (extensions: string) =>
	new RegExp(`^.*\\.(${extensions})$`, "i");

const imageRegExp = createRegExp("jpg|png|gif");

export type AssetType = HTMLImageElement;

/**
 * the user is receives a promise which resolves to a
 * a HTML Asset Element (HTMLImageElement)
 */
export const loadAsset = (url: string) => {
	return new Promise<AssetType>((resolve, reject) => {
		// temp func to load images from assets dir
		// not sure how this is less efficient than loading with cdn
		// we can go with this itself and chuck the cdn
		//
		// TODO: make it load even audio

		let asset: AssetType;
		if (imageRegExp.test(url)) asset = new Image();
		else return console.error("Trying to load a invalid file ", url);

		function handleLoad(event: Event | string) {
			if (typeof event === "string" || event.type === "error") {
				reject();
				return;
			}
			resolve(asset);
		}
		asset.onload = handleLoad;
		asset.oncanplaythrough = handleLoad;
		asset.onerror = handleLoad;
		asset.src = url;
	});
};

// export const mapAssetLoader = () => {
// 	// fetch the data for the current map, and
// 	// lazily load the other parts of the map
// 	const map : HTMLImageElement[] = [];
// 	mapData
// };

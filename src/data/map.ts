const mapData = [
	{
		name: "First Map",
		startX: 0,
		startY: 0,
		height: 500,
		width: 500,
		// Each grid => 10 x 10
		grid: [
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
		],
		source:
			"https://www.dreamincode.net/forums/uploads/post-242958-1246321970.jpg",
	},
];

const userSpriteData = {
	assets: {
		left: "",
		right: "",
		up: "",
		down: "",
		leftAnimation: "",
		rightAnimation: "",
		upAnimation: "",
		downAnimation: "",
	},
};

export { mapData, userSpriteData };

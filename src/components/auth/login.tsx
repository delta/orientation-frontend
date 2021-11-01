import React from "react";
import clockTower from "../../assets/images/AdminBlock_no_bg.png";
import styles from "./login.module.css";

const DAuthLogin = () => {
	return (
		<div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5">
			<div className="bg-gray-800 text-gray-500 rounded shadow-2xl py-5 px-5 w-3/5 h-3/4">
				<div className="flex items-center relative">
					<div
						className="pl-10 h-4/6 py-10 w-1/2 flipInX"
						// style={{ border: "1px solid white" }}
					>
						<h1 className=" text-gray-200 text-4xl font-bold">
							Login To
							<div className={styles.slidingVertical}>
								<span>Utopia.</span>
								<span>D-Auth.</span>
							</div>
						</h1>

						<p className=" text-gray-200 my-14 ">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
							consectetur quia totam culpa, asperiores, quisquam praesentium
							cumque quo iusto illum earum rem quos natus. Enim pariatur
							voluptatibus debitis cumque necessitatibus.
						</p>
						<button className="p-4 bg-green-600 rounded-lg font-bold text-white mt-2 hover:bg-gray-600">
							<a href="/game">Start The Journey</a>
						</button>
					</div>
					<div
						className="pl-10 h-4/6 w-1/2 justify-center justify-items-center"
						// style={{ border: "1px solid white" }}
					>
						<img
							src={clockTower}
							alt=""
							className={"h-full " + styles.clockTower}
						/>
						<p className="text-xl text-center font-bold">Clock Tower</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export { DAuthLogin };

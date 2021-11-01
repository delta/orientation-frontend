import React from "react";
import clockTower from "../../assets/images/AdminBlock_no_bg.png";
import deltaLogo from "../../assets/images/deltaLogoWhite.png";
import styles from "./login.module.css";

const DAuthLogin = () => {
	return (
		<div className="min-w-screen min-h-screen bg-background flex items-center justify-center px-5 py-5">
			<div className="bg-base text-gray-500 rounded shadow-2xl py-5 px-5 w-3/5 h-3/4">
				<div className="flex items-center relative">
					<div
						className="pl-10 h-4/5 py-10 w-1/2 flipInX"
						// style={{ border: "1px solid white" }}
					>
						<h1 className=" text-text text-4xl font-bold">
							Login To
							<div className={styles.slidingVertical + " inline text-accent1"}>
								<span>Utopia.</span>
								<span>D-Auth.</span>
							</div>
						</h1>

						<p className=" text-text my-14 ">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
							consectetur quia totam culpa, asperiores, quisquam praesentium
							cumque quo iusto illum earum rem quos natus. Enim pariatur
							voluptatibus debitis cumque necessitatibus.
						</p>
						<div className={styles.slidingVertical + " block h-20"}>
							<span>
								<button className="flex justify-between items-center bg-accent1 p-4 rounded-lg font-bold text-white mt-2 hover:bg-accent2">
									<a href="/game">Start The Journey</a>
								</button>
							</span>
							<span>
								<button className="flex justify-between items-center bg-accent1 p-4 w-40 rounded-lg font-bold text-white mt-2 hover:bg-accent2">
									<a href="/game">Login With </a>
									<img src={deltaLogo} className="w-7" />
								</button>
							</span>
						</div>
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
						<p className="text-xl text-center font-bold text-accent2">
							Clock Tower
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export { DAuthLogin };

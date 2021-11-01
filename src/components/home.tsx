import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
	return (
		<>
			<div className="p-20 h-screen flex justify-center items-start flex-col">
				<h1 className="text-5xl text-text">Welcome to Utopia 👋</h1>
				<p className="text-gray-400 mt-5 text-lg">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
					consequuntur odio aut nobis ab quis? Reiciendis doloremque ut quo
					fugiat eveniet tempora, atque alias earum ullam inventore itaque
					sapiente iste?
				</p>
				<button className="p-4 bg-green-600 rounded-lg font-bold text-text mt-5 hover:bg-gray-600">
					<Link to="/game">Start the journey</Link>
				</button>
			</div>
		</>
	);
};

export { HomePage };

import "./styles/output.css";

function App() {
	return (
		<div className="bg-gray-900 p-20 h-screen flex justify-center items-start flex-col">
			<h1 className="text-5xl text-white">Welcome to Utopia 👋</h1>
			<p className="text-gray-400 mt-5 text-lg">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
				consequuntur odio aut nobis ab quis? Reiciendis doloremque ut quo fugiat
				eveniet tempora, atque alias earum ullam inventore itaque sapiente iste?
			</p>
			<button className="p-4 bg-green-600 rounded-lg font-bold text-white mt-5 hover:bg-gray-600">
				Start the journey
			</button>
		</div>
	);
}

export default App;

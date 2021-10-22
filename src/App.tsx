import React from "react";
import "./styles/output.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/home";
import { GamePage } from "./pages/game";

function App() {
	return (
		<div className="bg-gray-900 h-full">
			<Router>
				<Switch>
					<Route path="/" exact>
						<HomePage />
					</Route>
					<Route path="/game">
						<GamePage />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;

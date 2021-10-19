import React from "react";
import "./styles/output.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/home";

function App() {
	return (
		<div className="bg-gray-900 h-full">
			<Router>
				<Switch>
					<Route path="/" exact>
						<HomePage />
					</Route>
					<Route path="/game">
						<h1>Game Route</h1>
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;

import React from "react";
import "./App.css";
import "./styles/output.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import { AuthPage } from "./pages/auth";

function App() {
	return (
		<div className="min-h-screen bg-background">
			<Router>
				<Switch>
					<Route path="/" exact>
						<HomePage />
					</Route>
					<Route path="/game">
						<h1>Game Route</h1>
					</Route>
					<Route path="/auth">
						<AuthPage />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;

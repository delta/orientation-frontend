import React from "react";
import "./App.css";
import "./styles/output.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import { AuthPage } from "./pages/auth";

import { ToastProvider } from "./components/toast/ToastProvider";
import { UserContextProvider } from "./contexts/userContext";

function App() {
	return (
		<div className="min-h-screen bg-background">
			<ToastProvider variant={"top_right"}>
				<UserContextProvider>
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
				</UserContextProvider>
			</ToastProvider>
		</div>
	);
}

export default App;

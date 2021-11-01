import React from "react";
import { Switch, Route } from "react-router-dom";
import { DAuthLogin } from "../components/auth";

const AuthPage = () => {
	return (
		<Switch>
			<Route path="/auth/login">
				<DAuthLogin />
			</Route>
		</Switch>
	);
};

export { AuthPage };

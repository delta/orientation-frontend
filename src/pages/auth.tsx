import React from "react";
import { Switch, Route } from "react-router-dom";
import { DAuthLogin, Register } from "../components/auth";

const AuthPage = () => {
	return (
		<Switch>
			<Route path="/auth/login">
				<DAuthLogin />
			</Route>
			<Route path="/auth/register">
				<Register />
			</Route>
		</Switch>
	);
};

export { AuthPage };

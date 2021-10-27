import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { UserPosition } from "../sceneManager";

interface Props {
	userPosition: UserPosition;
	setUserPosition: Dispatch<SetStateAction<UserPosition>>;
}

/**
 * This component is responsible for all the user game object related logic
 * We have to find a efficient way to re-render the user data
 */

const UserGameObject = (props: Props) => {
	console.log("log from the user object");
	const memo = useMemo(() => {
		return new Date();
	}, []);
	useEffect(() => {
		console.log("log from use effect with userPosition dependency");
		console.log(memo.toUTCString());
	}, [props.userPosition]);
	useEffect(() => console.log("log from effect without any dependency"), []);
	return <></>;
};

export { UserGameObject };

import React, { useEffect, useState, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { config } from "../../config/config";
import { UserContext } from "../../contexts/userContext";
import { axiosInstance } from "../../utils/axios";
// import { useQuery } from "../../utils/useQuery";

enum AuthStatusEnum {
	START,
	WAITING, // WAITING FOR DAUTH RESPONSE
	ACCEPTED,
	REJECTED,
	AUTH, // sending dauth data to backend
	ERROR, // some error occurred, ask user to try again
}

const DAuthCallBack = () => {
	// const params = useQuery();
	// console.log(params);
	const history = useHistory();

	const { loading, isLoggedIn, saveUser } = useContext(UserContext) || {};

	const [authStatus, setAuthStatus] = useState(AuthStatusEnum.START);

	// Generates A Dauth Auth url
	const generateDauthAuthorizeUrl = () => {
		const dauthAuthorizeURL = new URL("https://auth.delta.nitt.edu/authorize");

		const dauthQueryParameters = {
			client_id: config.dauth.clientId,
			redirect_uri: config.dauth.redirectURI,
			response_type: "code",
			state: "code", // TODO: Dynamically generate it
			grant_type: "authorization_code",
			scope: "email+openid+profile+user",
			nonce: "",
		};
		// console.log("params : ", dauthQueryParameters);

		const appendQueryParametersToURL = (url: URL, queryParams: Object) => {
			Object.keys(queryParams).forEach((query) => {
				// @ts-ignore
				url.searchParams.append(query, queryParams[query]);
			});
		};

		appendQueryParametersToURL(dauthAuthorizeURL, dauthQueryParameters);

		return dauthAuthorizeURL;
	};

	const sendAuthCodeToServer = useCallback(
		async (code: string) => {
			try {
				setAuthStatus(AuthStatusEnum.AUTH);
				console.log("hello");
				const resp = await axiosInstance.get(`/api/auth/callback?code=${code}`);

				console.log(resp.data);
				saveUser && saveUser(resp.data.user);
				console.log(resp.data.authStatus);
				console.log(resp.data.authStatus.isNewUser);
				if (resp.data.authStatus.isNewUser) {
					// redirect to register page
					console.log("new user");
					history.push("/auth/register");
				} else {
					// redirect to game page
					console.log("old user");
					history.push("/game");
				}
			} catch (err) {
				// if some error occurred its mostly because
				// the code was invalid / network issues
				//
				// setting the state as error
				// and we need to ask the user to try again later
				console.log(err);
				setAuthStatus(AuthStatusEnum.ERROR);
			}
		},
		[history, saveUser]
	);

	const BASE_URL = window.location.origin;
	const receiveMessage = useCallback(
		async (event: MessageEvent<any>) => {
			// console.log(event);
			// Do we trust the sender of this message? (might be
			// different from what we originally opened, for example).
			if (event.origin !== BASE_URL) {
				return;
			}
			const { data } = event;
			process.env.NODE_ENV === "development" &&
				data.source === "dauth-login-callback" &&
				console.log(data);
			// // if we trust the sender and the source is our popup
			if (data.source === "dauth-login-callback") {
				// if the user
				if (!data.code) setAuthStatus(AuthStatusEnum.REJECTED);
				else {
					setAuthStatus(AuthStatusEnum.ACCEPTED);
					sendAuthCodeToServer(data.code);
				}
				// TODO: need to see if state is same
				// and add some expiry for callback
			}
		},
		[BASE_URL, sendAuthCodeToServer]
	);

	// let windowObjectReference: Window | null = null;
	// let previousUrl: string | null = null;

	const [windowObjectReference, setWindowObjectReference] =
		useState<Window | null>(null);
	const [previousUrl, setPreviousUrl] = useState<string | null>(null);

	const openSignInWindow = useCallback(
		(url: string, name: string) => {
			// remove any existing event listeners
			window.removeEventListener("message", receiveMessage);

			// window features
			const strWindowFeatures =
				"toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

			if (windowObjectReference === null || windowObjectReference.closed) {
				/* 	
				if the pointer to the window object in memory does not exist
				or if such pointer exists but the window was closed 
			*/
				setWindowObjectReference(window.open(url, name, strWindowFeatures));
			} else if (previousUrl !== url) {
				/* 	
			if the resource to load is different,
			then we load it in the already opened secondary window and then
			we bring such window back on top/in front of its parent window. 
			*/
				setWindowObjectReference(window.open(url, name, strWindowFeatures));
				windowObjectReference?.focus();
			} else {
				/* 	
				else the window reference must exist and the window
				is not closed; therefore, we can bring it back on top of any other
				window with the focus() method. There would be no need to re-create
				the window or to reload the referenced resource. 
			*/
				windowObjectReference.focus();
			}
			console.log("opening new window");

			setAuthStatus(AuthStatusEnum.WAITING);

			// add the listener for receiving a message from the popup
			window.addEventListener("message", receiveMessage, false);
			// assign the previous URL
			setPreviousUrl(url);
		},
		[previousUrl, receiveMessage, windowObjectReference]
	);

	const generateDauthStringAndOpenUrl = useCallback(() => {
		const dauthURL = generateDauthAuthorizeUrl();
		process.env.NODE_ENV === "development" && console.log(dauthURL);
		console.log(dauthURL.toString());
		openSignInWindow(dauthURL.toString(), "dauthURL");
	}, [openSignInWindow]);

	// on page load, call dauth and verify user
	// and handle dauth response appropriately
	useEffect(() => {
		// if (!loading) return;
		console.log("hi");
		generateDauthStringAndOpenUrl();
	}, [generateDauthStringAndOpenUrl, openSignInWindow]);

	if (isLoggedIn) history.push("/game");
	if (loading) return <>Loading...</>;

	return (
		<>
			<div className="flex justify-center items-center min-h-screen">
				<div className="relative text-white">
					<div className="wrapper-border"></div>
					{authStatus === AuthStatusEnum.START ? (
						<>Setting things up ...</>
					) : authStatus === AuthStatusEnum.WAITING ? (
						<div className=" text-xl p-4">
							Login to DAuth To Continue
							<p className="text-sm text-center mt-8">
								Unable to see the window ?{" "}
								<p
									className="underline cursor-pointer"
									onClick={() => generateDauthStringAndOpenUrl()}
								>
									Click Here
								</p>
							</p>
						</div>
					) : authStatus === AuthStatusEnum.ACCEPTED ||
					  authStatus === AuthStatusEnum.AUTH ? (
						<>Finishing things up...</>
					) : authStatus === AuthStatusEnum.REJECTED ? (
						<div className=" text-xl p-4">
							Opps ! Looks like you denied permissions
							<p className="text-sm text-center mt-8">
								<span
									className="underline cursor-pointer"
									onClick={() => generateDauthStringAndOpenUrl()}
								>
									Click Here
								</span>
								to try again{" "}
							</p>
						</div>
					) : authStatus === AuthStatusEnum.ERROR ? (
						<div className=" text-xl p-4">
							Looks like something went wrong.
							<p className="text-sm text-center mt-8">
								<span
									className="underline cursor-pointer"
									onClick={() => generateDauthStringAndOpenUrl()}
								>
									Click Here
								</span>{" "}
								to try again{" "}
							</p>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</>
	);
};

export { DAuthCallBack };

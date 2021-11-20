import React, { createContext, useCallback, useState, useEffect } from "react";
import { axiosInstance } from "../utils/axios";

interface IUser {
	id?: number;
	name: string;
	email: string;
	aboutMe: string;
	gender: string;
	department: string;
}

export const UserContext = createContext<UserContextProviderProps | null>(null);

interface UserContextProviderProps {
	children?: React.ReactNode;

	loading: boolean;
	isLoggedIn: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	user: IUser | undefined;
	error: any;

	logout: () => void;
}

export const UserContextProvider: React.FC = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<IUser | undefined>();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState<any>();
	useEffect(() => {
		(async () => {
			try {
				const resp = await axiosInstance.get("/api/auth/checkAuth");
				console.log(resp.data.status);
				// setLoading(false);
				if (resp.data.status) {
					// the user has logged in, fetch his profile data
					// and return
					setIsLoggedIn(true);
				} else {
					setLoading(false);
				}
			} catch (err) {
				setError(err);
				setLoading(false);
				setIsLoggedIn(false);
				setUser(undefined);
				console.log(err);
			}
		})();
	}, []);

	// logs in the user, and saves his data to context
	const saveUser = (userData: IUser) => {
		setUser(userData);
		setIsLoggedIn(true);
	};

	const logout = () => {
		setUser(undefined);
	};

	return (
		<UserContext.Provider
			value={{ loading, isLoggedIn, setLoading, user, logout, error }}
		>
			{children}
		</UserContext.Provider>
	);
};

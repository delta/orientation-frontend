import React, { createContext, useState, useEffect } from 'react';
import { axiosInstance } from '../utils/axios';

export interface IUser {
    id: number;
    email: string;
    name: string;
    username: string;
    description: string;
    gender: string;
    department: string;
    isNewUser: boolean;
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
    saveUser: (user: IUser) => void;
}

export const UserContextProvider: React.FC = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IUser | undefined>();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState<any>();
    useEffect(() => {
        (async () => {
            try {
                const resp = await axiosInstance.get('/api/user/me');
                console.log(resp.data);
                if (resp.data) {
                    // the user has logged in, fetch his profile data
                    // and return
                    console.log(resp.data.user);
                    setUser({
                        id: resp.data.user.ID,
                        department: resp.data.user.Department,
                        description: resp.data.user.Desription,
                        email: resp.data.user.Email,
                        gender: resp.data.user.Gender,
                        username: resp.data.user.Username,
                        name: resp.data.user.Name,
                        isNewUser: resp.data.isNewUser
                    });
                    localStorage.setItem(
                        'userId',
                        JSON.stringify(resp.data.user.ID)
                    );
                    setIsLoggedIn(true);
                }
                setLoading(false);
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
        setIsLoggedIn(false);
    };

    return (
        <UserContext.Provider
            value={{
                loading,
                isLoggedIn,
                setLoading,
                user,
                logout,
                error,
                saveUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

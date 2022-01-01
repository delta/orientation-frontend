import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';

const HomePage = () => {
    const { isLoggedIn, user } = useContext(UserContext) || {};

    return (
        <>
            <div className="p-20 h-screen flex justify-center items-start flex-col">
                <h1 className="text-5xl text-text">Welcome to Utopia 👋</h1>
                <p className="text-gray-400 mt-5 text-lg">
                    Lets go on a journey where all that matters is the friends
                    we make along the way!
                </p>
                <Link
                    to={
                        isLoggedIn
                            ? user?.isNewUser
                                ? '/auth/register'
                                : '/game'
                            : '/auth/login'
                    }
                >
                    <button className="p-4 bg-green-600 rounded-lg font-bold text-text mt-5 hover:bg-gray-600">
                        Start the journey
                    </button>
                </Link>
            </div>
        </>
    );
};

export { HomePage };

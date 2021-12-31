import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { DAuthLogin, Register, DAuthCallBack } from '../components/auth';
import { Logout } from '../components/auth/logout';
import { UserContext } from '../contexts/userContext';

const AuthPage = () => {
    const { loading } = useContext(UserContext) || {};
    if (loading) return <>Loading...</>;
    return (
        <Switch>
            <Route exact path="/auth/login">
                <DAuthLogin />
            </Route>
            <Route exact path="/auth/register">
                <Register />
            </Route>
            <Route exact path="/auth/callback">
                <DAuthCallBack />
            </Route>
            <Route exact path="/auth/logout">
                <Logout />
            </Route>
        </Switch>
    );
};

export { AuthPage };

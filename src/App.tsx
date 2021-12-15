import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/output.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { HomePage } from './pages/home';
import { AuthPage } from './pages/auth';
import { Game } from './Phaser/Game/Game';

import { ToastProvider } from './components/toast/ToastProvider';
import { UserContextProvider } from './contexts/userContext';
import { Scene } from './Phaser/Scene/Scene';
import { Text } from './Phaser/GameObjects/Text';

function App() {
    const [i, changeI] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            console.log('changing i ');
            changeI(10);
        }, 2500);
    });

    return (
        <div className="min-h-screen bg-background">
            <ToastProvider variant={'top_right'}>
                <UserContextProvider>
                    <Router>
                        <Switch>
                            <Route path="/" exact>
                                <HomePage />
                            </Route>
                            <Route path="/game">
                                <Game>
                                    <Scene
                                        sceneKey="first-scene"
                                        autoStart={true}
                                    >
                                        <Text
                                            text="hello world"
                                            x={10 + i}
                                            y={10}
                                            style={{
                                                fontSize: '18px',
                                                color: '#fff'
                                            }}
                                        ></Text>
                                        <Text
                                            text="Hello"
                                            x={10 + i}
                                            y={35}
                                            style={{
                                                fontSize: '18px',
                                                color: '#fff'
                                            }}
                                        />
                                    </Scene>
                                    <Scene sceneKey="second-scene">
                                        <Text
                                            text="hello world 2.0"
                                            x={50}
                                            y={50}
                                            style={{
                                                fontSize: '18px',
                                                color: '#fff'
                                            }}
                                        />
                                    </Scene>
                                </Game>
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

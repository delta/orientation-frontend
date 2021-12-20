import './App.css';
import './styles/output.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { HomePage } from './pages/home';
import { AuthPage } from './pages/auth';
import { Game } from './Phaser/Game/Game';

import { ToastProvider } from './components/toast/ToastProvider';
import { UserContextProvider } from './contexts/userContext';
import { Scene } from './Phaser/Scene/Scene';

function App() {
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
                                        sceneKey="Entrance"
                                        autoStart={true}
                                        mapName="Entrance"
                                        tilesetNames={[
                                            'AdminGate',
                                            'Modern',
                                            'Fountain',
                                            'SereneVillage',
                                            'Trees'
                                        ]}
                                        layers={[
                                            'BaseOverhead2',
                                            'BaseOverhead1',
                                            'Base',
                                            'Background',
                                            'Grass'
                                        ]}
                                    ></Scene>
                                    <Scene
                                        sceneKey="Admin"
                                        autoStart={false}
                                        mapName="Admin"
                                        tilesetNames={[
                                            'AdminBlock',
                                            'Modern',
                                            'Fountain',
                                            'Roads',
                                            'SereneVillage',
                                            'Trees'
                                        ]}
                                        layers={[
                                            'BaseOverhead2',
                                            'BaseOverhead1',
                                            'Base',
                                            'Background',
                                            'Grass'
                                        ]}
                                    ></Scene>
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

import './App.css';
import './styles/output.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { HomePage } from './pages/home';
import { AuthPage } from './pages/auth';
import { GamePage } from './pages/Game';
import { MadeWithLove } from './components/MadeWithLove';
import Main from './components/videoCall/Main';
import { ToastProvider } from './components/toast/ToastProvider';
import { UserContextProvider } from './contexts/userContext';
import { Portal } from './pages/portal';

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
                                <GamePage />
                            </Route>
                            <Route path="/auth">
                                <AuthPage />
                            </Route>
                            <Route path="/joinvc">
                                <Main></Main>
                            </Route>
                        </Switch>
                    </Router>
                    <Portal />
                </UserContextProvider>
                <MadeWithLove />
            </ToastProvider>
        </div>
    );
}

export default App;

import React, { useCallback, useEffect, useState, Component } from 'react';
import { Game as PhaserGame } from 'phaser';
import { Renderer } from '../../renderer';
import { GameContext } from './GameContext';

interface GameProps {
    children?: JSX.Element | JSX.Element[];
}

interface GameState {
    gameRef: HTMLDivElement | null;
    phaserGame: PhaserGame | null;
    mountContainer: any;
}

class GameClass extends Component<GameProps, GameState> {
    constructor(props: GameProps) {
        super(props);
        this.state = {
            gameRef: null,
            mountContainer: null,
            phaserGame: null
        };
    }

    componentDidMount = () => {
        // console.log('Component did mount', this.state);
        // create a phaser game after initial render
        console.log('Component did mount', this.state);
        if (!this.state.gameRef) return;
        const game = new PhaserGame({
            height: 500,
            width: 500,
            parent: this.state.gameRef
        });
        console.log(game);

        // We create a new container with our custom renderer with the PhaserGameObject
        //
        // createContainer parameters = containerInfo, tag, hydrate, hydrationCallbacks
        // containerInfo -> the root container of our phaser game (Game obj obvi.)
        // tag = 0 -> we are creating a BlockingRoot (even though I don't understand what that means, but ReactDOM seems to be using this,
        // so if its good enough for it, its good enough for us)
        // hydrate -> we are not using any hydration,
        const mountContainerInstance = Renderer.createContainer(
            game,
            0,
            false,
            null
        );

        this.setState({ mountContainer: mountContainerInstance });
    };

    setGameRef = (gameObj: HTMLDivElement) => {
        console.log('setting game ref');
        this.setState({ gameRef: gameObj });
    };

    componentDidUpdate() {
        console.log('component updated');
    }

    render() {
        console.log('render');
        return (
            <div id="phaser-game" ref={this.setGameRef}>
                <GameContext.Provider value={this.state.phaserGame}>
                    {this.props.children}
                </GameContext.Provider>
            </div>
        );
    }
}

const Game = (props: GameProps) => {
    const [gameRef, setGameRef] = useState<HTMLDivElement | null>(null);
    const [phaserGame, setPhaserGame] = useState<PhaserGame | null>(null);
    const [mountContainer, setMountContainer] = useState<any>(null);

    const { children } = props;

    // console.log(React.findDOMNode);

    useEffect(() => {
        if (!gameRef) return;
        const game = new PhaserGame({
            height: 500,
            width: 500,
            parent: gameRef
        });

        // We create a new container with our custom renderer with the PhaserGameObject
        //
        // createContainer parameters = containerInfo, tag, hydrate, hydrationCallbacks
        // containerInfo -> the root container of our phaser game (Game obj obvi.)
        // tag = 0 -> we are creating a BlockingRoot (even though I don't understand what that means, but ReactDOM seems to be using this,
        // so if its good enough for it, its good enough for us)
        // hydrate -> we are not using any hydration,
        const mountContainerInstance = Renderer.createContainer(
            game,
            0,
            false,
            null
        );

        setMountContainer(mountContainerInstance);

        setPhaserGame(game);
        return () => {
            // when we destroy the game, we have to remove it from the Fiber renderer
            Renderer.updateContainer(null, mountContainer, null, () => {});
            game.destroy(true);
        };
    }, [gameRef]);

    useEffect(() => {
        // when ever the list of children changes , we call updateContainer to reconcile
        // and update the dom
        Renderer.updateContainer(children, mountContainer, null, () => {});
    }, [children]);

    return (
        <div id="phaser-game" ref={setGameRef}>
            <GameContext.Provider value={phaserGame}>
                {children}
            </GameContext.Provider>
        </div>
    );
};

export { GameClass as Game };

import React, { Component, RefObject, createRef } from 'react';
import { Game as PhaserGame } from 'phaser';
import { isEqual } from 'lodash';

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

// We have to use class component instead of functional component
// as we have to pass an instance of the root component to the updateContainer method
// of our custom renderer. Since Functional component are not instantiated,
// https://github.com/facebook/react/issues/4936#issuecomment-142379068
// we are forced to use class based components

class Game extends Component<GameProps, GameState> {
    // a ref for the html element inside which the game will be created
    gameRef!: RefObject<HTMLDivElement>;

    constructor(props: GameProps) {
        super(props);
        this.state = {
            gameRef: null,
            mountContainer: null,
            phaserGame: null
        };
        this.gameRef = createRef<HTMLDivElement>();
    }

    componentDidMount() {
        this.startGame();
    }

    // Creates a phaser game once the gameRef state has been initialized
    startGame = () => {
        // just checking to prevent typescript error
        if (!this.gameRef.current) return;
        //TODO: Get the Phaser game as properties, and initialize them instead of hard coding
        const game = new PhaserGame({
            height: 500,
            width: 500,
            parent: this.gameRef.current
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

        this.setState(
            {
                mountContainer: mountContainerInstance,
                phaserGame: game
            },
            this.updateContainer
        );

        game.events.on('ready', () => {
            console.log('game is ready');
        });
    };

    // we update the dom container everyTime the DOM Tree is updated
    updateContainer() {
        Renderer.updateContainer(
            this.props.children,
            this.state.mountContainer,
            this
        );
    }

    componentDidUpdate(prevProps: GameProps, prevState: GameState) {
        // we only update the container if the there is a change in props
        if (!isEqual(prevProps, this.props)) this.updateContainer();
        // or when mount container is intialized
        if (!prevState.mountContainer && this.state.mountContainer)
            this.updateContainer();
    }

    // simple debug function to know whats going on
    debug(...args: any) {
        process.env.NODE_ENV === 'development' && console.log(...args);
    }

    componentWillUnmount() {
        this.debug('Removing the game');
        Renderer.updateContainer(
            this.props.children,
            this.state.mountContainer,
            this
        );
        this.state.phaserGame?.destroy(true);
    }

    render() {
        return (
            <div id="phaser-game" ref={this.gameRef}>
                {this.state.mountContainer ? (
                    <GameContext.Provider value={this.state.phaserGame}>
                        {this.props.children}
                    </GameContext.Provider>
                ) : null}
            </div>
        );
    }
}

export { Game };

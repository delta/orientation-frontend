import React, { Component } from 'react';
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
    constructor(props: GameProps) {
        super(props);
        this.state = {
            gameRef: null,
            mountContainer: null,
            phaserGame: null
        };
    }

    componentDidMount = () => {
        // // console.log('Component did mount', this.state);
        // // create a phaser game after initial render
        // console.log('Component did mount', this.state);
        // if (!this.state.gameRef) return;
        // const game = new PhaserGame({
        //     height: 500,
        //     width: 500,
        //     parent: this.state.gameRef
        // });
        // console.log(game);
        // // We create a new container with our custom renderer with the PhaserGameObject
        // //
        // // createContainer parameters = containerInfo, tag, hydrate, hydrationCallbacks
        // // containerInfo -> the root container of our phaser game (Game obj obvi.)
        // // tag = 0 -> we are creating a BlockingRoot (even though I don't understand what that means, but ReactDOM seems to be using this,
        // // so if its good enough for it, its good enough for us)
        // // hydrate -> we are not using any hydration,
        // const mountContainerInstance = Renderer.createContainer(
        //     game,
        //     0,
        //     false,
        //     null
        // );
        // this.setState({ mountContainer: mountContainerInstance });
    };

    // Creates a phaser game once the gameRef state has been initialized
    startGame = () => {
        // just checking to prevent typescript error
        if (!this.state.gameRef) return;
        const game = new PhaserGame({
            height: 500,
            width: 500,
            parent: this.state.gameRef
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
    };

    // we update the dom container everyTime the DOM Tree is updated
    updateContainer = () => {
        Renderer.updateContainer(
            this.props.children,
            this.state.mountContainer,
            this
        );
    };

    setGameRef = (gameObj: HTMLDivElement) => {
        // we call startGame as a callback instead of calling it in componentDidMount
        // because it isn't guaranteed that the gameRef will be set to the container
        this.setState({ gameRef: gameObj }, this.startGame);
    };

    shouldComponentUpdate(newProps: GameProps, newState: GameState) {
        // we dont re-render if there is a change in state
        if (!isEqual(newProps, this.props)) return true;
        return false;
    }

    componentDidUpdate() {
        this.updateContainer();
    }

    render() {
        return (
            <div id="phaser-game" ref={this.setGameRef}>
                <GameContext.Provider value={this.state.phaserGame}>
                    {this.props.children}
                </GameContext.Provider>
            </div>
        );
    }
}

export { Game };

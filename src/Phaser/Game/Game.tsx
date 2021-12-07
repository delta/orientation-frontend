import React, { Component, RefObject, createRef } from 'react';
import { Game as PhaserGame } from 'phaser';
import { isEqual } from 'lodash';

import { Renderer } from '../../renderer';
import { GameContext } from './GameContext';

interface GameProps {
    children?: JSX.Element | JSX.Element[];
}

interface GameState {
    phaserGame: PhaserGame | null;
    mountContainer: any;
    booting: boolean;
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
            mountContainer: null,
            phaserGame: null,
            booting: true
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

        this.setState({
            mountContainer: mountContainerInstance,
            phaserGame: game
        });

        game.events.on('ready', () => {
            this.setState({ booting: false });
        });
    };

    // we update the dom container everyTime the DOM Tree is updated
    updateContainer() {
        Renderer.updateContainer(
            this.gameObject(),
            this.state.mountContainer,
            this
        );
    }

    gameObject() {
        return (
            <GameContext.Provider value={this.state.phaserGame}>
                {this.props.children}
            </GameContext.Provider>
        );
    }

    componentDidUpdate(prevProps: GameProps, prevState: GameState) {
        // update the container if the there is a change in props
        // TODO: Right now we are update whenever the props changes
        // but we should only do this when the children changes
        // If any other props (like the game config) changes,
        // we have to either
        //  -> either throw an error preventing the user from doing it,
        //      coz restoring the game state will be big issue
        //  -> restart the game and actually find some hacky way to restore the game
        if (!isEqual(prevProps, this.props)) this.updateContainer();
        // we update the container once the game is done booting
        // this will be the first time the container is updated
        // aka the we paint the container
        //
        // we have to do this because, we have to wait till the Game is
        // done booting before we are able to add the scenes and other game objects
        // which is conveniently not mentioned anywhere in the phaser docs
        //
        // after this the container will only update when the
        // children change.
        //
        if (prevState.booting && !this.state.booting) this.updateContainer();
    }

    // a boundary which catches all the errors which occur in the container
    componentDidCatch(err: any, info: any) {
        this.debug('Error : ', err, info);
    }

    // simple debug function to know whats going on
    debug(...args: any) {
        process.env.NODE_ENV === 'development' && console.log(...args);
    }

    componentWillUnmount() {
        Renderer.updateContainer(
            this.props.children,
            this.state.mountContainer,
            this
        );
        this.state.phaserGame?.destroy(true);
    }

    render() {
        // we only render the container inside which the phaser game will
        // be rendered in. All the Scenes and Game Objects are rendered
        // with the custom renderer we created.
        //
        // TODO: Right now we dont have any way to render, non Phaser
        // elements inside our container. We have to figure out a way to do that.

        return <div id="phaser-game" ref={this.gameRef} />;
    }
}

export { Game };

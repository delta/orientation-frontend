import React, { useEffect, useState } from 'react';
import { Game as PhaserGame } from 'phaser';
import { Renderer } from '../../renderer';
import { GameContext } from './GameContext';

interface GameProps {
    children?: JSX.Element | JSX.Element[];
}

const Game = (props: GameProps) => {
    const [gameRef, setGameRef] = useState<HTMLDivElement | null>(null);
    const [phaserGame, setPhaserGame] = useState<PhaserGame | null>(null);
    const [mountContainer, setMountContainer] = useState<any>(null);

    const { children } = props;

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
            Renderer.updateContainer(null, mountContainer);
            game.destroy(true);
        };
    }, [gameRef]);

    useEffect(() => {
        // when ever the list of children changes , we have to call the renderer
        // and update the container
    }, [children]);

    return (
        <div id="phaser-game" ref={setGameRef}>
            <GameContext.Provider value={phaserGame}>
                {props.children}
            </GameContext.Provider>
        </div>
    );
};

export { Game };

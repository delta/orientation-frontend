import React, { useEffect, useState } from 'react';
import { Game as PhaserGame } from 'phaser';
import { Renderer } from '../../renderer';
import { GameContext } from './GameContext';

const Game = () => {
    const [gameRef, setGameRef] = useState<HTMLDivElement | null>(null);
    const [phaserGame, setPhaserGame] = useState<PhaserGame | null>(null);
    useEffect(() => {
        if (!gameRef) return;
        const game = new PhaserGame({
            height: 500,
            width: 500,
            parent: gameRef
        });
        Renderer.createContainer(game, 0, false, null);
        setPhaserGame(game);
        return () => {
            game.destroy(true);
        };
    }, [gameRef]);
    return (
        <div id="phaser-game" ref={setGameRef}>
            <GameContext.Provider value={phaserGame}></GameContext.Provider>
        </div>
    );
};

export { Game };

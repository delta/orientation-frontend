import React, { useEffect, useState } from 'react';
import { Game as PhaserGame } from 'phaser';
import { Renderer } from '../renderer';

const Game = () => {
    const [gameRef, setGameRef] = useState<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!gameRef) return;
        const game = new PhaserGame({
            height: 500,
            width: 500,
            parent: gameRef
        });
        Renderer.createContainer(game, 0, false, null);
        return () => {
            game.destroy(true);
        };
    }, [gameRef]);
    return <div id="phaser-game" ref={setGameRef}></div>;
};

export { Game };

import React, { useEffect, useState } from 'react';
import { Game as PhaserGame } from 'phaser';
import { reconcilerInstance } from '../renderer/reconciler';

const Game = () => {
    const [gameRef, setGameRef] = useState<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!gameRef) return;
        const game = new PhaserGame({
            height: 500,
            width: 500,
            parent: gameRef
        });
        reconcilerInstance.createContainer(game, 0, false, null);
        return () => {
            console.log('deleting game');
            game.destroy(true);
        };
    }, [gameRef]);
    return <div id="phaser-game" ref={setGameRef}></div>;
};

export { Game };

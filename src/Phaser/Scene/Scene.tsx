import React, { useContext, useEffect } from 'react';
// import { GameObjects } from 'phaser';

import { PhaserScene } from './SceneWrapper';
import { GameContext } from '../Game/GameContext';

const Scene = (props: any) => {
    const game = useContext(GameContext);

    function init(this: PhaserScene) {
        console.log('init');
    }

    function preload(this: PhaserScene) {
        console.log('preload');
    }

    function create(this: PhaserScene) {
        console.log('create');
    }
    useEffect(() => {
        if (!game) return;
        const newScene = new PhaserScene({ key: 'firstScene' });
        console.log(game);
        newScene.init = init;
        newScene.preload = preload;
        newScene.create = create;
        game?.scene.add('firstScene', newScene, true);

        return () => {
            game?.scene.remove('firstScene');
        };
    }, [game]);
    return null;
};

export { Scene };

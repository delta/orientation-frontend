import React, { useContext, useEffect } from 'react';
// import { GameObjects } from 'phaser';

import { PhaserScene } from './SceneWrapper';
import { GameContext } from '../Game/GameContext';

interface ISceneProps {
    children?: React.ReactNode;
    sceneKey: string;
    init?: PhaserScene['init'];
    preload?: PhaserScene['preload'];
    create?: PhaserScene['create'];
}

const Scene = ({ children, sceneKey, create, init, preload }: ISceneProps) => {
    const game = useContext(GameContext);

    useEffect(() => {
        if (!game) return;
        const newScene = new PhaserScene({ key: sceneKey });
        console.log(game);
        // TODO: this is soo untidy, clean it up
        newScene.init = init ? init : null;
        newScene.preload = preload ? preload : null;
        newScene.create = create ? create : null;
        game?.scene.add('firstScene', newScene, true);

        return () => {
            game?.scene.remove(sceneKey);
        };
    }, [game]);
    return null;
};

export { Scene };

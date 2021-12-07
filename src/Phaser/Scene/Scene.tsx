import React, { useContext, useEffect, useState } from 'react';
// import { GameObjects } from 'phaser';

import { PhaserScene } from './SceneWrapper';
import { GameContext } from '../Game/GameContext';
import { SceneContext } from './sceneContext';

interface ISceneProps {
    children?: React.ReactNode;
    sceneKey: string;
    autoStart?: boolean;
    init?: PhaserScene['init'];
    preload?: PhaserScene['preload'];
    create?: PhaserScene['create'];
}

const Scene = ({
    children,
    sceneKey,
    autoStart,
    create,
    init,
    preload
}: ISceneProps) => {
    const game = useContext(GameContext);
    const [sceneInstance, setSceneInstance] = useState<PhaserScene | null>(
        null
    );

    useEffect(() => {
        if (!game) return;
        //TODO: have a props for sceneConfig ? only key has been implemented rn...
        const newScene = new PhaserScene({ key: sceneKey });
        // TODO: this is soo untidy, clean it up
        newScene.init = init ? init : null;
        newScene.preload = preload ? preload : null;
        newScene.create = create ? create : null;
        game?.scene.add(sceneKey, newScene, !!autoStart);

        // TODO: Find out how to wait till the assets are loaded before rendering the component
        //

        setSceneInstance(newScene);

        return () => {
            game?.scene.remove(sceneKey);
        };
    }, [game]);

    if (!sceneInstance) return null;
    return (
        <SceneContext.Provider value={sceneInstance}>
            {children}
        </SceneContext.Provider>
    );
};

export { Scene };

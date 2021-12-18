import React, { useContext, useEffect, useState } from 'react';
// import { GameObjects } from 'phaser';

import { PhaserScene } from './SceneWrapper';
import { GameContext } from '../Game/GameContext';
import { SceneContext } from './sceneContext';
import { GameScene } from './GameScene';

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
    const [sceneInstance, setSceneInstance] = useState<
        PhaserScene | GameScene | null
    >(null);

    useEffect(() => {
        if (!game) return;
        //TODO: have a props for sceneConfig ? only key has been implemented rn...
        const newScene = new PhaserScene({ key: sceneKey });
        // TODO: this is soo untidy, clean it up
        console.log('newScene Created', newScene.create);
        // if (init) newScene.init = init;
        // if (preload) newScene.preload = preload;
        // if (create) newScene.create = create;
        newScene.preload = () => {
            GameScene.preload(newScene);
        };
        newScene.create = () => {
            GameScene.create(newScene);
        };

        // newScene.create = ()=>{
        //     console.log("newScene Created");
        // }
        game?.scene.add(sceneKey, newScene, false);
        game.scene.start(sceneKey);
        // TODO: Find out how to wait till the assets are loaded before rendering the component
        //

        setSceneInstance(newScene);

        return () => {
            process.env.NODE_ENV === 'development' &&
                console.log('removing the scene');
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

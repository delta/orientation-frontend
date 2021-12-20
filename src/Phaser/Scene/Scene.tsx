import React, { useContext, useEffect, useState } from 'react';
// import { GameObjects } from 'phaser';

import { PhaserScene } from './SceneWrapper';
import { GameContext } from '../Game/GameContext';
import { SceneContext } from './sceneContext';
interface ISceneProps {
    children?: React.ReactNode;
    sceneKey: string;
    autoStart?: boolean;
    mapName?: string;
    tilesetNames?: string[];
    layers?: string[];
}

const Scene = ({
    children,
    sceneKey,
    autoStart,
    mapName,
    tilesetNames,
    layers
}: ISceneProps) => {
    const game = useContext(GameContext);
    const [sceneInstance, setSceneInstance] = useState<PhaserScene | null>(
        null
    );

    useEffect(() => {
        if (!game) return;
        //TODO: have a props for sceneConfig ? only key has been implemented rn...
        const newScene = new PhaserScene(
            { key: sceneKey },
            mapName ? mapName : '',
            tilesetNames ? tilesetNames : [],
            layers ? layers : []
        );

        game?.scene.add(sceneKey, newScene, !!autoStart);
        // TODO: Find out how to wait till the assets are loaded before rendering the component
        //

        setSceneInstance(newScene);

        return () => {
            process.env.NODE_ENV === 'development' &&
                console.log('removing the scene');
            game?.scene.remove(sceneKey);
        };
    }, [game, autoStart, layers, mapName, sceneKey, tilesetNames]);

    // useEffect(() => {
    //     sceneInstance.updatePositions(socketConext);
    // }, [socketContext]);

    if (!sceneInstance) return null;
    return (
        <SceneContext.Provider value={sceneInstance}>
            {children}
        </SceneContext.Provider>
    );
};

export { Scene };

import React, { useContext, useEffect, useState } from 'react';
// import { GameObjects } from 'phaser';

import { PhaserScene } from './SceneWrapper';
import { GameContext } from '../Game/GameContext';
import { SceneContext } from './sceneContext';
import { WsContext } from '../../contexts/wsContext';
import { WebsocketApi } from '../../ws/ws';
interface ISceneProps {
    children?: React.ReactNode;
    sceneKey: string;
    autoStart?: boolean;
    mapName?: string;
    tilesetNames?: string[];
    layers?: string[];
    ws: WebsocketApi;
}

const Scene = ({
    children,
    sceneKey,
    autoStart,
    mapName,
    tilesetNames,
    layers,
    ws
}: ISceneProps) => {
    const game = useContext(GameContext);
    const [sceneInstance, setSceneInstance] = useState<PhaserScene | null>(
        null
    );

    const sceneErrorHandler = (err: any) => {
        console.error('Scene error:', err);
    };

    useEffect(() => {
        if (!game) return;
        //TODO: have a props for sceneConfig ? only key has been implemented rn...
        const newScene = new PhaserScene(
            { key: sceneKey },
            ws,
            mapName ? mapName : '',
            tilesetNames ? tilesetNames : [],
            layers ? layers : [],
            sceneErrorHandler
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
    }, [game, autoStart, layers, mapName, sceneKey, tilesetNames, ws]);

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

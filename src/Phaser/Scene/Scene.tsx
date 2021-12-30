import React, { useContext, useEffect, useState } from 'react';
// import { GameObjects } from 'phaser';

import { PhaserScene } from './SceneWrapper';
import { GameContext } from '../Game/GameContext';
import { SceneContext } from './sceneContext';
import { WebsocketApi } from '../../ws/ws';

interface ISceneProps {
    children?: React.ReactNode;
    sceneKey: string;
    autoStart?: boolean;
    mapName?: string;
    tilesetNames?: string[];
    loadTilesetNames?: string[];
    layers?: string[];
    ws: WebsocketApi;
    spriteAnims?: Array<{
        playerKey: string;
        left: { start: number; end: number };
        right: { start: number; end: number };
        front: { start: number; end: number };
        back: { start: number; end: number };
    }>;
    spriteFrameRate?: number;
    zoom: number;
    playerDepth: number;
}

const Scene = ({
    children,
    sceneKey,
    autoStart,
    mapName,
    tilesetNames,
    ws,
    loadTilesetNames,
    layers,
    spriteAnims,
    spriteFrameRate,
    zoom,
    playerDepth
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
        const newScene = new PhaserScene({
            config: { key: sceneKey },
            mapName: mapName ? mapName : '',
            tilesetNames: tilesetNames ? tilesetNames : [],
            loadTilesetNames: loadTilesetNames ? loadTilesetNames : [],
            sceneErrorHandler,
            ws,
            layers: layers ? layers : [],
            spriteAnims,
            spriteFrameRate,
            zoom,
            playerDepth
        });

        game?.scene.add(sceneKey, newScene, !!autoStart);
        // TODO: Find out how to wait till the assets are loaded before rendering the component
        //

        setSceneInstance(newScene);

        return () => {
            process.env.NODE_ENV === 'development' &&
                console.log('removing the scene');
            game?.scene.remove(sceneKey);
        };
    }, [
        game,
        sceneKey,
        mapName,
        tilesetNames,
        loadTilesetNames,
        ws,
        layers,
        spriteAnims,
        spriteFrameRate,
        autoStart
    ]);

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

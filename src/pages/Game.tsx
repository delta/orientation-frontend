import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Scene } from '../Phaser/Scene/Scene';
import { Game } from '../Phaser/Game/Game';
// import { LoaderScene } from '../Phaser/Scene/Loader';
import { WebsocketApi } from '../ws/ws';
import { CONSTANTS } from '../config/constants';
import { LoaderScene } from '../Phaser/Scene/Loader';
import { MenuScene } from '../components/scenes/Menu';
import { config } from '../config/config';
import { usePortal } from '../contexts/portalContext';

const imageAssets = [
    { key: 'bg', url: 'bg.png' },
    { key: 'playButton', url: 'PlayButton.png' },
    { key: 'leaf', url: 'leaf.png' }
];

export const GamePage = () => {
    const history = useHistory();
    const ws = useMemo(() => {
        try {
            return new WebsocketApi();
        } catch (err) {
            history.push('/auth/login');
        }
    }, [history]);

    const portal = usePortal();

    // opens the moda with the given data
    const openModal = (data: string) => {
        portal?.setOpen(true);
        portal?.setCurrentMethod(data as any);
    };

    return (
        <div>
            <div
                id="phaser-font"
                style={{
                    fontFamily: 'PixelFont',
                    height: '0px',
                    visibility: 'hidden'
                }}
            >
                You are not supposed to see this. But here you go
                https://www.youtube.com/watch?v=xvFZjo5PgG0
            </div>
            <Game>
                <LoaderScene nextScene="Menu" {...CONSTANTS.LOADER} />
                <MenuScene
                    SceneKey="Menu"
                    imageAssets={imageAssets}
                    imageAssetsPrefixPath={config.assetUrl + '/Images'}
                    ws={ws}
                    nextScene="Entrance"
                />
                {
                    <React.Fragment>
                        {CONSTANTS.SCENES.map((scene, i) => {
                            return (
                                <Scene
                                    key={i}
                                    ws={ws as WebsocketApi}
                                    sceneKey={scene.SCENE_KEY}
                                    mapName={scene.MAP_NAME}
                                    tilesetNames={scene.TILESET_NAMES}
                                    loadTilesetNames={scene.LOAD_TILESET_NAMES}
                                    layers={scene.LAYERS}
                                    spriteAnims={CONSTANTS.SPRITE_ANIMATION}
                                    spriteFrameRate={
                                        CONSTANTS.SPRITE_ANIMATION_FRAME_RATE
                                    }
                                    playerDepth={scene.DEPTH}
                                    openModal={openModal}
                                ></Scene>
                            );
                        })}
                    </React.Fragment>
                }
            </Game>
        </div>
    );
};

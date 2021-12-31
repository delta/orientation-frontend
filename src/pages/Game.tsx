import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { LogoutIcon } from '@heroicons/react/outline';

import { Scene } from '../Phaser/Scene/Scene';
import { Game } from '../Phaser/Game/Game';
// import { LoaderScene } from '../Phaser/Scene/Loader';
import { WebsocketApi } from '../ws/ws';
import { CONSTANTS } from '../config/constants';
import { LoaderScene } from '../Phaser/Scene/Loader';
import { MenuScene } from '../components/scenes/Menu';
import { config } from '../config/config';
import { clsx } from '../utils/clsx';
import { axiosInstance } from '../utils/axios';

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

    const modalData = useCallback((data: string) => {
        const event = new CustomEvent('portal-listener', { detail: data });
        document.dispatchEvent(event);
    }, []);
    const logout = async () => {
        await axiosInstance.get('api/auth/logout');
        history.push('/');
    };

    const clickCounter = () => {
        history.push('/orientation-team');
    };

    return (
        <div>
            <div className="left-0 top-0  w-full p-2 text-base rounded-b-lg bg-blue-400 mb-5">
                <h1 className="inline-block text-4xl my-3 ml-5 font-bold tracking-wide">
                    Ut
                    <span onClick={clickCounter}>o</span>
                    pia
                </h1>
                <LogoutIcon
                    className={clsx(
                        'inline-block float-right my-3 ml-3',
                        'text-gray-700 transition-all hover:text-text cursor-pointer'
                    )}
                    height={35}
                    width={35}
                    onClick={logout}
                />
            </div>
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
            <div
                className="relative"
                style={{
                    height: '80vh'
                }}
            >
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
                                        loadTilesetNames={
                                            scene.LOAD_TILESET_NAMES
                                        }
                                        layers={scene.LAYERS}
                                        spriteAnims={CONSTANTS.SPRITE_ANIMATION}
                                        spriteFrameRate={
                                            CONSTANTS.SPRITE_ANIMATION_FRAME_RATE
                                        }
                                        zoom={scene.ZOOM}
                                        playerDepth={scene.DEPTH}
                                        openModal={modalData}
                                    ></Scene>
                                );
                            })}
                        </React.Fragment>
                    }
                </Game>
            </div>
        </div>
    );
};

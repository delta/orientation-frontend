import React, { useCallback, useContext, useMemo } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import { Scene } from '../Phaser/Scene/Scene';
import { Game } from '../Phaser/Game/Game';
// import { LoaderScene } from '../Phaser/Scene/Loader';
import { WebsocketApi } from '../ws/ws';
import { CONSTANTS } from '../config/constants';
import { LoaderScene } from '../Phaser/Scene/Loader';
import { MenuScene } from '../components/scenes/Menu';
import { config } from '../config/config';
import Chat from '../components/chat/Chat';
import { UserContext } from '../contexts/userContext';
// import styles from '../components/videoCall/styles.module.css';
import Main from '../components/videoCall/Main';
const imageAssets = [
    { key: 'bg', url: 'bg.png' },
    { key: 'playButton', url: 'PlayButton.png' },
    { key: 'leaf', url: 'leaf.png' }
];

export const GamePage = () => {
    const history = useHistory();
    const { loading, isLoggedIn } = useContext(UserContext) || {};

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

    if (loading) return <></>;

    if (!isLoggedIn) return <Redirect to="/auth/login" />;

    return (
        <div>
            <div className="h-screen flex flex-row">
                <div
                    id="phaser-font"
                    style={{
                        fontFamily: 'PixelFont',
                        height: '0px',
                        visibility: 'hidden',
                        width: '0px'
                    }}
                >
                    You are not supposed to see this. But here you go
                    https://www.youtube.com/watch?v=xvFZjo5PgG0
                </div>
                <div className="flex-grow relative mr-2">
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
                                            spriteAnims={
                                                CONSTANTS.SPRITE_ANIMATION
                                            }
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
                    <Main></Main>
                </div>

                <Chat ws={ws} />
            </div>
        </div>
    );
};

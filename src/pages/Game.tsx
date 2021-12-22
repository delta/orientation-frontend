import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Scene } from '../Phaser/Scene/Scene';
import { Game } from '../Phaser/Game/Game';
// import { LoaderScene } from '../Phaser/Scene/Loader';
import { WebsocketApi } from '../ws/ws';
import { CONSTANTS } from '../config/constants';
import { LoaderScene } from '../Phaser/Scene/Loader';

export const GamePage = () => {
    const history = useHistory();
    const ws = useMemo(() => {
        try {
            return new WebsocketApi();
        } catch (err) {
            history.push('/auth/login');
        }
    }, [history]);

    return (
        <Game>
            <LoaderScene nextScene="Entrance" {...CONSTANTS.LOADER} />
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
                            ></Scene>
                        );
                    })}
                </React.Fragment>
            }
        </Game>
    );
};

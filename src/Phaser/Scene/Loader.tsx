import React, { useContext, useEffect } from 'react';

import { PhaserScene } from './SceneWrapper';
import { GameContext } from '../Game/GameContext';
import { invariant } from '../../utils/invariant';

export interface LoaderProps {
    imagePrefixPath?: string;
    images?: { url: string; key: string }[];
    audioPrefixPath?: string;
    audio?: { url: string; key: string }[];
    spritesPrefixPath?: string;
    sprites?: { url: string; key: string }[];
    spriteSize?: { frameHeight: number; frameWidth: number };
    tileMapsPrefixPath?: string;
    tileMaps?: { url: string; key: string }[];
    nextScene: string;
    loadingAnimationFunction?: (scene: PhaserScene) => any;
}

// A Custom scene to be set as a loader
/**
 * A Common Loader scene to load all the required assets for the game
 * We can pass different types of assets like
 * 1. Image
 * 2. Audio
 * 3. Sprites
 * 4. tileMap (from JSON)
 *
 * This component loads all these assets, and we can pass a loadingAnimationFunction
 * which can be used to display a loading screen.
 *
 * After loading the assets, the scene will shift control to the scene passed
 * through the nextScene prop
 */
export const LoaderScene = ({
    imagePrefixPath,
    images,
    audioPrefixPath,
    audio,
    spritesPrefixPath,
    sprites,
    spriteSize,
    tileMapsPrefixPath,
    tileMaps,
    nextScene,
    loadingAnimationFunction
}: LoaderProps) => {
    const game = useContext(GameContext);

    const validateProps = () => {
        invariant(!(imagePrefixPath && !images), 'Images not provided');
        invariant(!(audioPrefixPath && !audio), 'Audio not provided');
        invariant(!(tileMapsPrefixPath && !tileMaps), 'Sprites not provided');
        invariant(
            !(spritesPrefixPath && (!sprites || !spriteSize)),
            'Sprites not provided'
        );

        if (images && !imagePrefixPath) imagePrefixPath = '';
        if (audio && !audioPrefixPath) audioPrefixPath = '';
        if (sprites && !spritesPrefixPath) spritesPrefixPath = '';
    };

    const loadAssets = (scene: PhaserScene) => {
        if (imagePrefixPath !== undefined) {
            console.log('loadingImages');
            scene.load.setPath(imagePrefixPath);
            images?.forEach((img) => {
                try {
                    scene.load.image(img);
                } catch (err) {
                    // we catch an error when the key is not unique
                    console.log(err);
                }
            });
        }
        if (audioPrefixPath !== undefined) {
            scene.load.setPath(audioPrefixPath);
            audio?.forEach((aud) => {
                try {
                    scene.load.audio(aud);
                } catch (err) {
                    // we catch an error when the key is not unique
                    console.log(err);
                }
            });
        }
        if (spritesPrefixPath !== undefined) {
            scene.load.setPath(spritesPrefixPath);
            sprites?.forEach((sprite) => {
                try {
                    scene.load.spritesheet({
                        ...sprite,
                        frameConfig: spriteSize
                    });
                } catch (err) {
                    // we catch an error when the key is not unique
                    console.log(err);
                }
            });
        }
        if (tileMaps !== undefined) {
            scene.load.setPath(tileMapsPrefixPath);
            tileMaps.forEach((tilemap) => {
                try {
                    scene.load.tilemapTiledJSON(tilemap.key, tilemap.url);
                } catch (err) {
                    // we catch an error when the key is not unique
                    console.log(err);
                }
            });
        }
    };

    useEffect(() => {
        if (!game) return;

        validateProps();
        const newScene = new PhaserScene({
            config: { key: 'LoadScene' },
            layers: [],
            loadTilesetNames: [],
            mapName: '',
            tilesetNames: [],
            sceneErrorHandler: () => {},
            ws: null
        });
        newScene.preload = () => {
            loadAssets(newScene);
            loadingAnimationFunction && loadingAnimationFunction(newScene);
        };
        // switching to the next scene once all the assets are loaded
        newScene.create = () => {
            console.log('moving to next scene');
            newScene.scene.start(nextScene);
        };

        game?.scene.add('LoadScene', newScene, true);

        return () => {
            game?.scene.remove('LoadScene');
        };
    }, [game]);

    return 'Scene' as unknown as JSX.Element;
};

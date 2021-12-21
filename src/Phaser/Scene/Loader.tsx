import React, { useContext, useEffect } from 'react';

import { PhaserScene } from './SceneWrapper';
import { GameContext } from '../Game/GameContext';
import { invariant } from '../../utils/invariant';

interface LoaderProps {
    imagePrefixPath?: string;
    images?: { url: string; key: string }[];
    audioPrefixPath?: string;
    audio?: { url: string; key: string }[];
    spritesPrefixPath?: string;
    sprites?: { url: string; key: string }[];
    spriteSize?: { frameHeight: number; frameWidth: number };
    nextScene: string;
    loadingAnimationFunction?: (...args: any) => any;
}

// A Custom scene to be set as a loader
export const LoaderScene = ({
    imagePrefixPath,
    images,
    audioPrefixPath,
    audio,
    spritesPrefixPath,
    sprites,
    spriteSize,
    nextScene,
    loadingAnimationFunction
}: LoaderProps) => {
    const game = useContext(GameContext);

    const validateProps = () => {
        invariant(!(imagePrefixPath && !images), 'Images not provided');
        invariant(!(audioPrefixPath && !audio), 'Audio not provided');
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
    };

    useEffect(() => {
        if (!game) return;

        validateProps();
        const newScene = new PhaserScene(
            { key: 'LoadScene' },
            null,
            '',
            [],
            [],
            () => {}
        );
        newScene.preload = () => {
            loadAssets(newScene);
            loadingAnimationFunction && loadingAnimationFunction();
        };
        // switching to the next scene once all the assets are loaded
        newScene.create = () => {
            // newScene.scene.start(nextScene);
        };

        game?.scene.add('LoadScene', newScene, true);

        return () => {
            game?.scene.remove('LoadScene');
        };
    }, [game]);

    return 'Scene' as unknown as JSX.Element;
};

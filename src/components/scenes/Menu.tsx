import React, { useContext, useEffect } from 'react';
import { Scene } from 'phaser';

import { phaserLoadingAnimation } from '../../utils/loadingAnimation';
import { WebsocketApi } from '../../ws/ws';
import { GameContext } from '../../Phaser/Game/GameContext';
import SpawnPoints from '../../utils/spawnPoints';

interface MenuSceneProps {
    SceneKey: string;
    ws?: WebsocketApi;
    imageAssetsPrefixPath: string;
    imageAssets: {
        key: string;
        url: string;
    }[];
    nextScene: string;
}

export const MenuScene = (props: MenuSceneProps) => {
    const game = useContext(GameContext);

    useEffect(() => {
        if (!game) return;

        const newScene = new Scene(props.SceneKey);

        //@ts-ignore
        newScene.preload = () => {
            const preloadFunction = (scene: Scene) => {
                scene.load.setPath(props.imageAssetsPrefixPath);
                props.imageAssets.forEach((img) => {
                    scene.load.image(img);
                });

                phaserLoadingAnimation(scene);
            };
            preloadFunction(newScene);
        };

        //@ts-ignore
        newScene.create = () => {
            const createFunction = (scene: Scene) => {
                const bg = scene.add.image(
                    scene.cameras.main.width / 2,
                    scene.cameras.main.height / 2,
                    'bg'
                );
                let scaleX = scene.cameras.main.width / bg.width;
                let scaleY = scene.cameras.main.height / bg.height;
                let scale = Math.max(scaleX, scaleY);
                let width = (scene.cameras.main.width * 1) / 7;
                let height = (scene.cameras.main.height * 1) / 7;

                const particles = scene.add.particles('leaf');

                particles.createEmitter({
                    // frame: 'blue',
                    x: { min: 0, max: scene.cameras.main.width },
                    y: 0,
                    lifespan: 5000,
                    speed: { min: 100, max: 200 },
                    angle: 90,
                    gravityY: 20,
                    frequency: 200,
                    scale: 0.1
                });

                bg.setScale(scale).setScrollFactor(0);
                const heading = scene.add.text(width, height, 'UTOPIA', {
                    fontFamily: 'PixelFont',
                    fontSize: '90px',
                    stroke: '#232121',
                    strokeThickness: 5,
                    align: 'left'
                });
                const playButton = scene.add.image(
                    width,
                    height + 125,
                    'playButton'
                );
                playButton.setOrigin(0, 0);
                playButton.setScale(1.5);

                playButton.setInteractive();

                playButton.on('pointerup', () => {
                    scene.scene.start(props.nextScene, { origin: 'menu' });
                });
            };
            createFunction(newScene);
        };

        game.scene.add(props.SceneKey, newScene, false);
    }, [game, props]);

    return null;
};

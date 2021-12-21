import {
    LoaderScene,
    LoaderProps as LoaderSceneProps
} from '../../Phaser/Scene/Loader';
import { config } from '../../config/config';
import { PhaserScene } from '../../Phaser/Scene';

const loadSceneData: Omit<LoaderSceneProps, 'nextScene'> = {
    imagePrefixPath: config.assetUrl + '/TilesetImages',
    images: [
        { key: 'AdminGate', url: 'AdminGate.png' },
        { key: 'Modern', url: 'Modern.png' },
        { key: 'Fountain', url: 'Fountain.png' },
        { key: 'SereneVillage', url: 'SereneVillage.png' },
        { key: 'Roads', url: 'Roads.png' },
        { key: 'Trees', url: 'Trees.png' }
    ]
    // tileMapsPrefixPath: config.assetUrl + "/TilesetImages",
    // tileMaps: [
    // ],
    // spritesPrefixPath: config.assetUrl + "/sprites",
    // sprites: [
    //     {key: "player1", url: "player1"}
    // ],
};

interface LoaderProps {
    nextScene: string;
}

export const Loader = (props: LoaderProps) => {
    const LoadingAnimation = function (scene: PhaserScene) {
        const width = scene.cameras.main.width;
        const height = scene.cameras.main.height;
        const progressBar = scene.add.graphics();
        const progressBox = scene.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        const loadingText = scene.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                color: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = scene.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px monospace',
                color: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        const assetText = scene.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                color: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        scene.load.on('progress', function (value: number) {
            percentText.setText(Math.round(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(
                width / 2 - 150,
                height / 2 - 15,
                300 * value,
                30
            );
        });

        scene.load.on('fileprogress', function (file: any) {
            assetText.setText('Loading asset: ' + file.key);
        });
        scene.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    };

    return (
        <LoaderScene
            nextScene={props.nextScene}
            {...loadSceneData}
            loadingAnimationFunction={LoadingAnimation}
        />
    );
};

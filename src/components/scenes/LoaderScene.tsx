import {
    LoaderScene,
    LoaderProps as LoaderSceneProps
} from '../../Phaser/Scene/Loader';
import { config } from '../../config/config';

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
    return <LoaderScene nextScene={props.nextScene} {...loadSceneData} />;
};

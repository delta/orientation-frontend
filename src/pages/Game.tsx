import React from 'react';
import { Game } from '../Phaser/Game/Game';
import { Scene } from '../Phaser/Scene/Scene';
import { LoaderScene } from '../Phaser/Scene/Loader';
import { Loader } from '../components/scenes/LoaderScene';

export const GamePage = () => {
    return (
        <Game>
            <Loader nextScene={'Entrance'} />
            <Scene
                sceneKey="Entrance"
                autoStart={true}
                mapName="Entrance"
                tilesetNames={['Modern', 'Fountain', 'SereneVillage', 'Trees']}
                loadTilesetNames={['AdminGate']}
                layers={[
                    'BaseOverhead2',
                    'BaseOverhead1',
                    'Base',
                    'Background',
                    'Grass'
                ]}
            ></Scene>
            <Scene
                sceneKey="Admin"
                autoStart={false}
                mapName="Admin"
                tilesetNames={[
                    'Modern',
                    'Fountain',
                    'Roads',
                    'SereneVillage',
                    'Trees'
                ]}
                loadTilesetNames={['AdminBlock']}
                layers={[
                    'BaseOverhead2',
                    'BaseOverhead1',
                    'Base',
                    'Background',
                    'Grass'
                ]}
            ></Scene>
        </Game>
    );
};

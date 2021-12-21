import React from 'react';
import { Game } from '../Phaser/Game/Game';
import { Scene } from '../Phaser/Scene/Scene';

export const GamePage = () => {
    return (
        <Game>
            <Scene
                sceneKey="Entrance"
                autoStart={true}
                mapName="Entrance"
                tilesetNames={[
                    'AdminGate',
                    'Modern',
                    'Fountain',
                    'SereneVillage',
                    'Trees'
                ]}
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
                    'AdminBlock',
                    'Modern',
                    'Fountain',
                    'Roads',
                    'SereneVillage',
                    'Trees'
                ]}
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

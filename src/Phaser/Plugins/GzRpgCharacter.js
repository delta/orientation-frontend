import Phaser from 'phaser';

/**
 * Parent class for all PC and NPC characters
 */
export class RpgCharacter extends Phaser.GameObjects.Sprite {
    constructor({ scene, name, x, y, id, type, facing }) {
        super(scene, x, y, type);

        this.name = name || 'anonymous';
        this.speed = 100;
        this.image = type;
        this.defaultTiles = {
            left: 13,
            right: 33,
            front: 18,
            back: 0
        };
        let displayName = name === 'player' ? 'you' : name;
        if (String(displayName).length > 10) {
            displayName = String(displayName).substring(0, 8) + '...';
        }
        this.text = this.scene.add
            .text(this.x, this.y + 20, displayName, {
                fontFamily: 'PixelFont',
                fontSize: '20px',
                color: '#e8f22e',
                stroke: '#232121',
                strokeThickness: 2,
                align: 'left'
            })
            .setDepth(100)
            .setOrigin(0.5, 0.5)
            .setScale(0.5);
        this.id = id;
        // Character movements are passed as instruction objects to
        // be evaluated on the next call to update
        this.instructions = [];
        // Attach this sprite to the loaded physics engine
        scene.physics.world.enable(this, 0);
        // Add this sprite to the scene
        scene.add.existing(this);
        // scale the sprite
        this.scale = 0.5;
        this.body.setSize(this.width / 2, this.height / 5);
        this.type = type;
        this.setTexture(type, `${type}-${this.defaultTiles[facing]}`);
        this.facing = 'back';

        // speech-box
        this.shouldDisplaySpeechBox = false;
        this.speechBoxText = '';
        this.speechBoxInstance = null;

        this.me = this;
    }

    displaySpeechBox(text) {
        this.shouldDisplaySpeechBox = true;
        this.speechBoxText = text;
        return true;
    }

    hideSpeechBox() {
        this.shouldDisplaySpeechBox = false;
        this.speechBoxText = '';
    }

    setSpeechBoxText(text) {
        this.speechBoxText = text;
    }

    renderSpeechBox() {
        if (!this.shouldDisplaySpeechBox) return;
        if (!this.speechBoxInstance) {
            this.speechBoxInstance = this.scene.add
                .text(this.x, this.y - 20, this.speechBoxText, {
                    fontFamily: 'monospace',
                    align: 'center',
                    backgroundColor: '#11111177',
                    padding: { right: 15, y: 35, left: 25 }
                })
                .setDepth(5000)
                .setFontSize(50)
                .setScale(0.1)
                .setOrigin(0.5, 0.5);
        } else {
            this.speechBoxInstance.setX(this.x);
            this.speechBoxInstance.setY(this.y - 20);
        }
    }

    update() {
        this.body.setVelocity(0);
        this.DoInstructions();
        if (
            this.body &&
            this.body.velocity.x === 0 &&
            this.body.velocity.y === 0
        ) {
            this.anims.stopAfterRepeat(0);
        }
        this.text.setX(this.x);
        this.text.setY(this.y + 20);
        this.renderSpeechBox();
    }

    /**
     * Cancel local velocity and stop animation
     */
    DoHalt() {
        this.body.setVelocity();
        this.anims.stopAfterRepeat(0);
    }

    /**
     * Push a provided instruction object onto the stack
     */
    SetInstruction(instruction) {
        if (!instruction.action) return;
        // Walking requires a direction
        if (instruction.action === 'walk' && !instruction.option) return;

        this.facing = instruction.option;

        this.instructions.push(instruction);
    }

    /**
     * Process the current instruction stack
     */
    DoInstructions() {
        while (this.instructions.length > 0) {
            // Unload the first instruction from the stack
            let instruction = this.instructions.pop();
            switch (instruction.action) {
                case 'walk':
                    this.DoWalk(instruction.option);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Process a walk instruction
     */
    DoWalk(direction) {
        switch (direction) {
            case 'left':
                this.body.setVelocityX(-this.speed);
                break;
            case 'right':
                this.body.setVelocityX(this.speed);
                break;
            case 'back':
                this.body.setVelocityY(-this.speed);
                break;
            case 'front':
                this.body.setVelocityY(this.speed);
                break;
            default:
                break;
        }

        this.body.velocity.normalize().scale(this.speed);

        if (this.body.velocity.y < 0)
            this.anims.play(this.image + '-walk-back', true);
        else if (this.body.velocity.y > 0)
            this.anims.play(this.image + '-walk-front', true);
        else if (this.body.velocity.x < 0)
            this.anims.play(this.image + '-walk-left', true);
        else if (this.body.velocity.x > 0)
            this.anims.play(this.image + '-walk-right', true);
    }

    MoveAndUpdate(player) {
        // TODO: Can write a better method for moving between coordinates
        this.x = player.Position.X;
        this.y = player.Position.Y;
        this.setTexture(
            this.type,
            `${this.type}-${this.defaultTiles[player.Position.Direction]}`
        );
        this.text.setX(this.x);
        this.text.setY(this.y + 20);
    }
}

export class GzRpgCharacterPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject(
            'rpgcharacter',
            this.createRpgCharacter
        );
    }

    createRpgCharacter(params) {
        //return this.displayList.add(new RpgCharacter({scene: this.scene, ...params}));
        // console.trace(this.scene);
        return new RpgCharacter({ scene: this.scene, ...params });
    }
}

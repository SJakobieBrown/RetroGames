import PhaserSplashScene from './phaserSplash/phaserSplash.js';
import SnakeScene from './snake/snake.js';
import SceneSelector from './sceneSelector.js';
import GameOverScene from './snake/gameover.js';
import SimonScene from './simon/simon.js';

export default class RetroGamesFrameScene extends Phaser.Scene {
    constructor() {
        super('RetroGamesFrameScene');
        this.gameScene;
    }

    preload() {
        this.load.setBaseURL('/RetroGames/assets/');
        this.load.image('background', 'retroGamesBackground.png');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0).setDepth();
        this.scene.launch('SceneSelector');
        this.scene.bringToTop('SceneSelector');

        let text = 'Retro Games';
        let fontSize = 64;
        let textObjs = [];
        for (let i = 0; i < text.length; i++) {
            textObjs.push(this.add.text(0, 0, text[i], { fontSize: `${fontSize}px`, fill: '#fff', fontWeight: 'bold'}).setDepth(1).setAlpha(0));
        }
        textObjs[0].setPosition(textObjs[0].displayWidth / 2+32, 50);
        textObjs[1].setPosition(textObjs[0].x + textObjs[0].displayWidth + textObjs[1].displayWidth / 2, 50);
        textObjs[2].setPosition(textObjs[1].x + textObjs[1].displayWidth + textObjs[2].displayWidth / 2, 50);
        textObjs[3].setPosition(textObjs[2].x + textObjs[2].displayWidth + textObjs[3].displayWidth / 2, 50);
        textObjs[4].setPosition(textObjs[3].x + textObjs[3].displayWidth + textObjs[4].displayWidth / 2, 50);
        textObjs[5].setPosition(textObjs[4].x + textObjs[4].displayWidth + textObjs[5].displayWidth / 2, 50);
        textObjs[6].setPosition(textObjs[5].x + textObjs[5].displayWidth + textObjs[6].displayWidth / 2, 50);
        textObjs[7].setPosition(textObjs[6].x + textObjs[6].displayWidth + textObjs[7].displayWidth / 2, 50);
        textObjs[8].setPosition(textObjs[7].x + textObjs[7].displayWidth + textObjs[8].displayWidth / 2, 50);
        textObjs[9].setPosition(textObjs[8].x + textObjs[8].displayWidth + textObjs[9].displayWidth / 2, 50);
        textObjs[10].setPosition(textObjs[9].x + textObjs[9].displayWidth + textObjs[10].displayWidth / 2, 50);

        for (let i = 0; i < textObjs.length; i++) {
            this.tweens.add({
                targets: textObjs[i],
                alpha: '1',
                duration: 1000,
                repeat: 0,
                delay: i * 100
            });
        }
    }
}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'canvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [PhaserSplashScene, SceneSelector, SnakeScene, GameOverScene, SimonScene, RetroGamesFrameScene]
};

let game = new Phaser.Game(config);
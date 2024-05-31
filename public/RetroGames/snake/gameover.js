

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
        this.score = null;
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        this.cameras.main.setSize(400, 400);
        this.cameras.main.setPosition(200, 184);
        this.cameras.main.setBackgroundColor('#000000');
        this.add.text(100, 100, 'Game Over     Score: ' + this.score, { fill: '#0f0' });
        this.add.text(100, 200, 'Press SPACE to return to the main menu', { fill: '#0f0' });
        this.input.keyboard.on('keydown', function (event) {
            if (event.keyCode === 32) {
                // Restart the Game scene
                this.scene.start('SceneSelector');
            }
        }, this);
    }  
}
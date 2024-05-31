// Description: A simple snake game using Phaser 3

export default class SnakeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Snake' });
        this.snake;
        this.food;
        this.cellSize = 16;
        this.score = 0;
        this.width;
        this.height;
        this.center;
        this.userInput = 'none';
        this.active;
        this.keys;
        
    }

    preload() {
        this.load.setBaseURL('/RetroGames/snake/assets/');
        this.load.image('snake', 'snake.png');
        this.load.image('apple', 'apple.png');
        //this.load.image('selectedRadio', 'selectedRadioButton.png');
        //this.load.image('unselectedRadio', 'unselectedRadioButton.png');
        this.width = 400/16;
        this.height = 400/16;
        this.center = { 'x': 200, 'y': 200 };
    }


    create() {
        this.cameras.main.setSize(400, 400);
        this.cameras.main.setPosition(200, 184);
        this.cameras.main.setBackgroundColor('#000000');
        this.score = 0;
        this.userInput = 'none';
        this.active = true;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys("W,A,S,D");
        this.snake = new Snake(this,2,this.center.x,this.center.y,'snake');
        this.food = new Food(this, -16, -16, 'apple');
        this.food.changeLocation();
    }

    update(){
        if (!this.active) {
            this.endGame();
            return;
        }
        this.getUserInput(this);
        this.snake.getUserInput(this.userInput);
        if (this.snake.checkCoordinates()) {
            this.snake.turnSnake();
        }
        this.snake.eatFood();
        this.snake.moveSnake();
        if (this.snake.checkCollision()) {
            this.active = false;
        }
        
    }
    
    endGame() {
        if (!this.checkCursorKeys()) {
            this.scene.start('GameOver', {score: this.score});
            this.scene.bringToTop('GameOver');
            // this.scene.setVisible(false, 'Snake');
            // this.waitForKeyRelease().then(() => {
            //     this.scene.stop();
            // });
        }
    }

    createCoord(x, y) {
        return { 'x': x, 'y': y };
    }

    getUserInput(scene) {
        if (this.cursors.up.isDown || this.keys.W.isDown) {
            scene.userInput = 'up';
            console.log("userInput: " + scene.userInput);
        } else if (this.cursors.down.isDown || this.keys.S.isDown) {  
            scene.userInput = 'down';
            console.log("userInput: " + scene.userInput);
        } else if (this.cursors.left.isDown || this.keys.A.isDown) {  
            scene.userInput = 'left';
            console.log("userInput: " + scene.userInput);
        } else if (this.cursors.right.isDown || this.keys.D.isDown) { 
            scene.userInput = 'right';
            console.log("userInput: " + scene.userInput);
        }
    }

    checkCursorKeys() {
        return this.cursors.down.isDown || this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.right.isDown;
    }

}

export class Segment extends Phaser.GameObjects.Image {
    constructor(scene, x, y, key, speed) {
        super(scene, x, y, key);
        this.scene = scene;
        this.direction = 'none';
        this.speed = speed;
        this.scene.add.existing(this); // Add this image to the scene
    }

    turn(dir) {
        this.direction = dir;
    }

    move() {
        if (this.direction === 'none') {
            return;
        } else if (this.direction === 'up') {
            this.y -= this.speed;
        } else if (this.direction === 'down') {
            this.y += this.speed;
        } else if (this.direction === 'left') {
            this.x -= this.speed;
        } else if (this.direction === 'right') {
            this.x += this.speed;
        }
    }
}

export class Snake extends Phaser.Physics.Arcade.Group {
    constructor(scene, speed, x, y, key) {
        super(scene.physics.world, scene, {
            classType: Segment,
            runChildUpdate: true,
            key: key,
            repeat: 0,
            setXY: { x: x, y: y }
        });

        this.count = 1;
        this.direction = 'none';
        this.nextDirection = 'none';
        this.speed = speed;
        this.getChildren()[0].setDepth(1);
        this.getChildren()[0].speed = this.speed;
    }

    moveSnake() {
        for (let i = 0; i < this.getChildren().length; i++) {
            this.getChildren()[i].move();
        }
    }

    turnSnake() {
        this.direction = this.nextDirection;
        for (let i = this.getChildren().length -1; i > 0; i--) {
            this.getChildren()[i].turn(this.getChildren()[i-1].direction);
        }
        this.getChildren()[0].turn(this.direction);
    }

    getUserInput(dir) {
        //console.log("is this happening?")
        //console.log("dir: " + dir);
        if (this.direction === 'none') {
            this.nextDirection  = dir;
            //console.log("nextDirection: " + this.nextDirection);
        } else if (this.direction === 'up' || this.direction === 'down') {
            if (dir === 'left' || dir === 'right') {
                this.nextDirection = dir;
            }
        }else if (this.direction === 'left' || this.direction === 'right') {
            if (dir === 'up' || dir === 'down') {
                this.nextDirection = dir;
            }
        }
    }
    eatFood() {
        if (this.getChildren()[0].x === this.scene.food.x && this.getChildren()[0].y === this.scene.food.y) {
            this.count++;
            this.scene.score++;
            let lastSegment = this.getChildren()[this.getChildren().length-1];
            this.create(lastSegment.x, lastSegment.y, 'snake',this.speed).setDepth(1);
            this.scene.food.changeLocation();
        }
    }
    checkCollision() {
        for (let i = 1; i < this.getChildren().length; i++) {
            if (this.getChildren()[0].x === this.getChildren()[i].x && this.getChildren()[0].y === this.getChildren()[i].y) {
                return true;
            }
        }
        if (this.getChildren()[0].x < 0 || this.getChildren()[0].x >= this.scene.width * 16 || this.getChildren()[0].y < 0 || this.getChildren()[0].y >= this.scene.height * 16) {
            return true;
        }
        return false;
    }
    checkCoordinates() {
        return (this.getChildren()[0].x+8) % 16 === 0 && (this.getChildren()[0].y+8) % 16 === 0;
    }
}


export class Food extends Phaser.GameObjects.Image{
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
    }

    randomCoord() {
        let rand;
        do {
            rand = this.scene.createCoord(Math.floor(Math.random() * this.scene.width) * 16 + 8, Math.floor(Math.random() * this.scene.height) * 16 + 8);
        } while (!this.compareCoords(rand));
        return rand;
    }

    compareCoords(coord1){
        for (let i = 0; i < this.scene.snake.getChildren().length; i++) {
            if (coord1.x === this.scene.snake.getChildren()[i].x && coord1.y === this.scene.snake.getChildren()[i].y) {
                return false;
            }
        }
        return true;
    }

    changeLocation() {
        let coord = this.randomCoord();
        this.x = coord.x;
        this.y = coord.y;
    }

}

class radioButtons {
    constructor(scene, x, y, selectedKey, unselectedKey) {
    }
}


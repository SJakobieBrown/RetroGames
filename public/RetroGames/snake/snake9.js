export class SnakeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Snake' });
        this.snake;
        this.food;
        this.score = 0;
        this.bounds;
        this.center;
        this.userInput = 'none';
        this.gameOver = false;
        this.keys;
        this.collidables;
        this.targetTime = 0;
        this.lastUpdateTime = 0;
        
    }

    //load assets for the game
    preload() {
        this.load.image('snake', './assets/snake.png');
        this.load.image('apple', './assets/apple.png');
        this.load.image('bound', './assets/white1x1.png');
        this.bounds = {'width': this.sys.game.config.width, 'height': this.sys.game.config.height};
        this.center = { 'x': this.sys.game.config.width/2, 'y': this.sys.game.config.height/2 };
    }

    //set up and start the game
    create() {
        this.score = 0;
        this.userInput = 'none';
        this.gameOver = false;
        this.collidables = this.physics.add.group();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys("W,A,S,D");
        this.snake = new Snake(this,4,this.center.x,this.center.y,'snake');
        this.food = new Food(this, -16, -16, 'apple');
        this.food.changeLocation();
        this.collidables.add(this.food);
        console.log(this.food.x, this.food.y);
        this.createColliders();
    }

    // Game loop
    update(time){
        if (this.gameOver) {
            this.endGame();
            return;
        }
        this.getUserInput();// this.userInput = realtime directional input
        this.snake.getDirection(); // this.snake.direction = this.userInput if valid
        for (let i = 0; i < this.snake.getChildren().length; i++) {// move snake
            this.snake.getChildren()[i].moveSegment(this.targetTime);
        }
        if (time - this.lastUpdateTime > this.targetTime) {
            this.lastUpdateTime = time;
            this.snake.head.getDirection();
            this.targetTime = 4;
        }
    }
     
    endGame() {
        if (this.checkCursorKeys()){
            return;
        }
        this.scene.start('GameOver', {score: this.score});
    }

    createCoord(x, y) {
        return { 'x': x, 'y': y };
    }

    getUserInput() {
        if (this.cursors.up.isDown || this.keys.W.isDown) {
            this.userInput = 'up';
        } else if (this.cursors.down.isDown || this.keys.S.isDown) {  
            this.userInput = 'down';
        } else if (this.cursors.left.isDown || this.keys.A.isDown) {  
            this.userInput = 'left';
        } else if (this.cursors.right.isDown || this.keys.D.isDown) { 
            this.userInput = 'right';
        }
    }

    checkCursorKeys() {
        return this.cursors.up.isDown || this.keys.W.isDown || this.cursors.down.isDown || this.keys.S.isDown || this.cursors.left.isDown || this.keys.A.isDown || this.cursors.right.isDown || this.keys.D.isDown;       
    }

    createColliders(){;
        let bounds = this.physics.add.staticGroup();
        for (let i = 0; i< this.bounds.width/8; i++){
                bounds.create(i*8,-1,'bound');
                bounds.create(i*8,this.bounds.width+1,'bound');
        }
        for (let i = 0; i< this.bounds.height/8; i++){
                bounds.create(-1,i*8,'bound');
                bounds.create(this.bounds.height+1,i*8,'bound');
        }
        this.physics.add.collider(this.snake.getChildren()[0], bounds, ()=>{
            this.gameOver = true;
        });
        this.physics.add.overlap(this.snake.getChildren()[0], this.collidables, ()=>{
            this.snake.eatFood();
        });
        this.snake.checkCollision();
    }
}

export class Segment extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, speed) {
        super(scene, x, y, key);
        this.scene = scene;
        this.direction = 'none';
        this.speed = speed;
        this.moving = false;
        this.isHead = false;
        this.animating = false;
        this.scene.add.existing(this); 
        this.dirDict = {
            'up': {'x': 0, 'y': -1},
            'down': {'x': 0, 'y': 1},
            'left': {'x': -1, 'y': 0},
            'right': {'x': 1, 'y': 0},
            'none': {'x': 0, 'y': 0}
        };
    }

    getDirection(){
        if (this.isHead) {
            let next = this.scene.snake.getChildren()[1];
            if (next !== undefined) {
                next.direction = this.direction;
                next.getDirection();
            }
            this.direction = this.scene.snake.direction;
        } else {
            let index = this.scene.snake.getChildren().indexOf(this);
            let next = this.scene.snake.getChildren()[index+1];
                if (next !== undefined){
                    next.direction = this.direction;
                    next.getDirection();
                }
        }
    }
    moveSegment(time) {
        if (this.direction === 'none') {
            return;
        }
        this.x += this.dirDict[this.direction].x * 16/time;
        this.y += this.dirDict[this.direction].y * 16/time;       
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
        //set up snake
        this.count = 1;
        this.direction = 'none';
        this.nextDirection = 'none';
        this.speed = speed;
        //set up head
        this.head = this.getChildren()[0];
        this.head.setDepth(1);
        this.head.speed = this.speed;
        this.head.isHead = true;
    }

    getDirection() {
        let dir = this.scene.userInput;
        if (this.direction === 'none') {
            this.nextDirection  = dir;
        } else if (this.direction === 'up' || this.direction === 'down') {
            if (dir === 'left' || dir === 'right') {
                this.nextDirection = dir;
            }
        }else if (this.direction === 'left' || this.direction === 'right') {
            if (dir === 'up' || dir === 'down') {
                this.nextDirection = dir;
            }
        }
        this.direction = this.nextDirection;
    }
    eatFood() {
        //if (this.getChildren()[0].x === this.scene.food.x && this.getChildren()[0].y === this.scene.food.y) {
            this.count++;
            this.scene.score++;
            let lastSegment = this.getChildren()[this.getChildren().length-1];
            //this.push(
                this.create(lastSegment.x, lastSegment.y, 'snake',this.speed).setDepth(1);
            //);
            this.scene.food.changeLocation();
        //}
    }

    checkCollision() {

        this.scene.physics.add.collider(this.getChildren()[0], this.getChildren(), (col,col1) => {
            if (col === this.head && col1 === this.getChildren()[1] || col1 === this.head && col === this.getChildren()[1]){
                return;
            } else if(col === this.head || col1 === this.head) {
                this.scene.gameOver = true;
            }
        });
    }
}


export class Food extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
    }

    randomCoord() {
        let rand;
        do {
            rand = this.scene.createCoord(Math.floor(Math.random() * this.scene.bounds.width/16) * 16 + 8, Math.floor(Math.random() * this.scene.bounds.height/16) * 16 + 8);
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


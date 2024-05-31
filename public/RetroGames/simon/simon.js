export default class SimonScene extends Phaser.Scene {
    constructor() {
        super('Simon');
        this.combination = [];
        this.guess = [];
        this.round = 0;
        this.state = 'CountDown';
        this.gameOver = false;
        this.challenge = 3;
        this.synth;
        //this.textOut;
    }

    preload() {
        this.load.setBaseURL('/RetroGames/simon/assets/');
        this.load.spritesheet('buttons', 'colorButtons.png', {
            frameWidth: 50, 
            frameHeight: 50, 
            endFrame: 7
        });
    }

    create() {
        this.cameras.main.setSize(400, 400);
        this.cameras.main.setPosition(200, 184);
        this.cameras.main.setBackgroundColor('#000000');
        this.synth = new Tone.Synth().toDestination();
        this.textOut = this.add.text(50, 50, 'Ready!', { font: '32px Arial', fill: '#ffffff' });
        this.simonWheel = new simonWheel(this, 200, 200);
    }

    update() {
        if (this.gameOver){
            return;
        }
        //begin round
        if (this.state === 'CountDown'){
            this.state = 'wait';
            this.countDown();
        }
        //simon's turn
        if (this.state === 'SimonTurn'){
            this.state = 'wait';
            this.simonsTurn();
        }
        //player's turn
        if (this.state === 'PlayerTurn'){
            this.simonWheel.enable();
            this.state = 'wait';
        }   
    }

    countDown(){
        this.textOut.setText('Round: ' + (this.round+1));
            setTimeout(() => {
                this.textOut.setText('3');
                setTimeout(() => {
                    this.textOut.setText('2');
                    setTimeout(() => {
                        this.textOut.setText('1');
                        setTimeout(() => {
                            this.textOut.setText('');
                            this.state = 'SimonTurn';
                        }, 500);
                    }, 500);
                }, 500);
            },500);
    }

    simonsTurn(){
        this.round++;
            //add to combination
            let r = Math.floor(Math.random()*4);
            if (this.round === 1){
                this.combination.push(Math.floor(Math.random()*4));
                r = Math.floor(Math.random()*4);
                this.combination.push(r);
                    r = Math.floor(Math.random()*4);
            }
            this.combination.push(Math.floor(Math.random()*4));

            //play combination
            for (let i = 0; i < this.combination.length; i++) {
                setTimeout(() => {
                    this.simonWheel.getChildren()[this.combination[i]].play();
                }, (500*i)+(300*i));
            }
            setTimeout(() => {
                this.state = 'PlayerTurn';
                this.textOut.setText('Go!');
            }, (500*this.combination.length)+(300*this.combination.length))
    }
}

class colorButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame, note, durr, index) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.note = note;
        this.durr = durr;
        this.index = index;
        this.on('pointerdown', () => {
            this.scene.guess.push(index);
            this.click();
        });
        this.scene.add.existing(this);
    }
    
    click(){
        this.disableInteractive();
        this.setFrame(this.frame.name+1);
        this.scene.synth.triggerAttackRelease(this.note, this.durr);
        //SoundGenerator.play(this.note, .5);
        if (this.scene.guess[this.scene.guess.length-1] !== this.scene.combination[this.scene.guess.length-1]){
            this.scene.gameOver = true;
            this.scene.textOut.setText('Game Over!');
            this.scene.simonWheel.disable();
        }
        if (this.scene.guess.length === this.scene.combination.length){
            this.scene.simonWheel.disable();
        }
        setTimeout(() => {
            this.setFrame(this.frame.name-1);
            if (this.scene.guess.length !== this.scene.combination.length && !this.scene.gameOver){
                this.setInteractive();
            } else{
                this.scene.guess = [];
                this.scene.state = 'CountDown';
            }
        }, 500);
    }
    play(){
        this.setFrame(this.frame.name+1);
        this.scene.synth.triggerAttackRelease(this.note, this.durr);
        //SoundGenerator.play(this.note, .5);
        setTimeout(() => {
            this.setFrame(this.frame.name-1);
        }, 500);
    }
}

class simonWheel extends Phaser.GameObjects.Group{
    constructor(scene, x, y){
        super(scene, x, y,);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.classType = colorButton;
        this.scene.add.existing(this);
        this.init();
    }

    init(){
        this.add(new colorButton(this.scene, 150, 150, 'buttons', 0, "A3", "8n", 0));
        this.add(new colorButton(this.scene, 200, 150, 'buttons', 2, "C4", "8n", 1));
        this.add(new colorButton(this.scene, 200, 200, 'buttons', 4, "E4", "8n", 2));
        this.add(new colorButton(this.scene, 150, 200, 'buttons', 6, "G4", "8n", 3));
        // this.add(new colorButton(this.scene, 150, 150, 'buttons', 0, SoundGenerator.notes.a3, 0));
        // this.add(new colorButton(this.scene, 200, 150, 'buttons', 2, SoundGenerator.notes.c4, 1));
        // this.add(new colorButton(this.scene, 200, 200, 'buttons', 4, SoundGenerator.notes.e4, 2));
        // this.add(new colorButton(this.scene, 150, 200, 'buttons', 6, SoundGenerator.notes.g4, 3));
    }

    enable(){
        this.getChildren().forEach((button) => {
            button.setInteractive();
        });
    }
    disable(){
        this.getChildren().forEach((button) => {
            button.disableInteractive();
        });
    }
}



    // note = 'A4', duration = '8n';
    //     const synth = new Tone.Synth().toDestination();
    //     synth.triggerAttackRelease(note, duration);

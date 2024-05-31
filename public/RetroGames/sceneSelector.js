const scenes = ['Snake', 'Simon' ];


export default class SceneSelector extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneSelector' });
    }

    preload() {
        this.load.setBaseURL('/RetroGames/assets/');
        this.load.image('selectable', 'retroGamesSelectable.png')
        this.load.image('scrollBar', 'retroGamesScrollBarHandle.png');
        this.load.image('scrollBarHandle', 'retroGamesScrollBar.png');
    }

    create() {
        this.cameras.main.setSize(400, 400);
        this.cameras.main.setPosition(200, 184);
        this.selectables = this.add.container(16,0);
        scenes.forEach((sceneKey, index) => {
                this.selectables.add( new Selectable(this, 88, (index*16)+9, 'selectable', sceneKey).container);
        });
        this.scrollBar = new scrollBar(this, 368,0);
        let itemContainerHeight = this.selectables.list.length*32+1;
        let itemsRemainingHeight = itemContainerHeight - 400;
        let itemsUpperBound = -itemsRemainingHeight;   
        let itemsLowerBound = 0;
        this.selectables.y = itemsLowerBound;
        let startPosition = this.selectables.y;

        this.events.on('positionChanged', () => {
            this.selectables.y = startPosition - this.scrollBar.percentageMoved*itemsRemainingHeight;
            this.selectables.y = Phaser.Math.Clamp(this.selectables.y, itemsUpperBound, itemsLowerBound);
        });

    }
}

class Selectable{
    constructor(scene, x, y, key, text) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.key = key;
        this.container = this.scene.add.container(this.x, this.y);
        this.sprite = this.scene.add.image(this.x, this.y, this.key).setOrigin(.5);
        this.text = this.scene.add.text(this.x, this.y, text, { fill: '#0f0' }).setOrigin(.5);
        this.container.add(this.sprite);
        this.container.add(this.text);
        this.sprite.setInteractive();
        this.sprite.on('pointerdown', () => {
            this.scene.input.stopPropagation();
            this.scene.scene.start(text);
            this.scene.scene.bringToTop(text);
        });
    }
}

class ScrollCursor extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y, key) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.events = new Phaser.Events.EventEmitter();
  }

  setPosition(x, y) {
    super.setPosition(x, y);

    // Emit a custom event
    this.scene.events.emit('positionChanged', this);
  }

}

class scrollBar {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.dragging = false;
        this.enabled = false;
        this.start = this.y;
        this.container = this.scene.add.container(this.x, this.y);
        this.bar = this.scene.add.image(this.x, this.y, 'scrollBar').setOrigin(0);
        this.handle = new ScrollCursor(this.scene, this.x, this.y, 'scrollBarHandle');// Create that bug here by getting rid of .scene. The solution is that you're not giving the correct argument. Might be tough for it.
        this.percentageMoved; 
        this.handle.setOrigin(0);
        let totalHeight = 400;
        let handleScale = 1;
        let itemContainerHeight = scene.selectables.list.length*33;
        if (itemContainerHeight > 400) {
            handleScale = totalHeight/itemContainerHeight;
            this.enabled = true;
        }
        let handleHeight = totalHeight*handleScale;
        let remainingHeight = totalHeight - handleHeight;
        let upperBound = 0;
        let lowerBound = remainingHeight;
        

        this.handle.setScale(1,handleScale);
        if (this.enabled){
            this.handle.setInteractive();
        }
        let difference;
        this.handle.on('pointerdown', () => {
            this.dragging = true;
            difference = this.scene.input.activePointer.y - this.handle.y;
        });
        document.getElementById('canvas').addEventListener('wheel', (event) => {
            event.preventDefault();
            if (!this.enabled) {
                return;
            }
            if (event.deltaY > 0) {
                if (this.handle.y < lowerBound) {
                    this.handle.y += remainingHeight/(handleHeight*2);                
                }
            } else {
                if (this.handle.y >= upperBound) {
                    this.handle.y -= remainingHeight/(handleHeight*2);
                }
            }
            this.handle.y = Phaser.Math.Clamp(this.handle.y, upperBound, lowerBound);
            this.percentageMoved = (this.handle.y - upperBound)/(lowerBound-upperBound);
            this.scene.events.emit('positionChanged', this);


        });
        document.addEventListener('mouseup', () => {
            this.dragging = false;
        });
        this.scene.input.on('pointermove', (pointer) => {
            if (!this.enabled) {
                return;
            }
            if (this.dragging) {
                    if(this.handle.y >= upperBound) {
                        this.handle.y = Phaser.Math.Clamp(pointer.y-difference, upperBound, lowerBound);
                    } else if (this.handle.y < lowerBound) {
                        this.handle.y = Phaser.Math.Clamp(pointer.y-difference, upperBound, lowerBound);
                    }
                    this.percentageMoved = (this.handle.y - upperBound)/(lowerBound-upperBound);
                    this.scene.events.emit('positionChanged', this);
                }
        });

    }
}


export default class PhaserSplashScene extends Phaser.Scene
    {
        constructor (){
            super({ key: 'Phaser Splash' });
        }

        preload ()
        {   
            this.load.setBaseURL('/RetroGames/phaserSplash/assets/');
            //this.load.setBaseURL('./assets/');
            this.load.spritesheet('logos', 'Phaser Logos 288x62.png', { frameWidth: 288, frameHeight: 62 });
            this.load.image('sky', 'space3.png');
            this.width = this.sys.game.config.width;
            this.height = this.sys.game.config.height;
        }

        
        create ()
        {
            this.sky = this.add.image(this.width/2, this.height/2, 'sky');
            this.sky.x = this.sky.width/2;
            this.logo = this.add.sprite(this.width/2,this.height/2, 'logos').setFrame(0).setDepth(3);
            this.logo_red = this.add.sprite(this.width/2,-128, 'logos').setFrame(1).setDepth(2);
            this.logo_green = this.add.sprite(-31,831, 'logos').setFrame(2).setDepth(2);
            this.logo_blue = this.add.sprite(831,831, 'logos').setFrame(3).setDepth(2);
            this.logo_cyan = this.add.sprite(this.width/2,528, 'logos').setFrame(4).setDepth(1);
            this.logo_yellow = this.add.sprite(-31,-31, 'logos').setFrame(5).setDepth(1);
            this.logo_magenta = this.add.sprite(831,-31, 'logos').setFrame(6).setDepth(1);
            

            this.logoAnimation();
            this.skyAnimation();
            // SoundGenerator.play(SoundGenerator.notes.a6, .25)
            // setTimeout(() => {
            //     SoundGenerator.play(SoundGenerator.notes.g6, .25)
            //     setTimeout(() => {
            //         SoundGenerator.play(SoundGenerator.notes.e6, .25)
            //         setTimeout(() => {
            //             SoundGenerator.play(SoundGenerator.notes.c6, .25)
            //         }, 500);
            //     },500);
            // }, 500);
        }

        logoAnimation(){
            let _ease = 'Power4'
            let _duration = 1000;
            this.logo.setAlpha(0);
            this.logo_red.setAlpha(.5);
            this.logo_green.setAlpha(.5);
            this.logo_blue.setAlpha(.5);
            this.logo_cyan.setAlpha(.5);
            this.logo_yellow.setAlpha(.5);
            this.logo_magenta.setAlpha(.5);
            this.tweens.add({
                targets: this.logo_red,
                y:this.height/2, 
                x:this.width/2, 
                duration: _duration, 
                ease: _ease
            });
            this.tweens.add({
                targets: this.logo_green,
                y:this.height/2, 
                x:this.width/2, 
                duration: _duration, 
                ease: _ease
            });
            this.tweens.add({
                targets: this.logo_blue,
                y:this.height/2, 
                x:this.width/2, 
                duration: _duration, 
                ease: _ease
            });
            this.tweens.add({
                targets: this.logo_cyan,
                y:this.height/2, 
                x:this.width/2, 
                duration: _duration, 
                ease: _ease
            });
            this.tweens.add({
                targets: this.logo_yellow,
                y:this.height/2, 
                x:this.width/2, 
                duration: _duration, 
                ease: _ease
            });
            this.tweens.add({
                targets: this.logo_magenta,
                y:this.height/2, 
                x:this.width/2, 
                duration: _duration, 
                ease: _ease
            });
            this.tweens.add({
                targets: this.logo,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.endAnimations();
                }
            })
        }
        
        endAnimations(){
            this.tweens.add({
                targets: this.logo,
                alpha: 1,
                duration: 500,
                onComplete: () => {
                    this.finalAnimation();
                }
            })
            this.tweens.add({
                targets: [this.logo_red, this.logo_green, this.logo_blue, this.logo_cyan, this.logo_yellow, this.logo_magenta],
                alpha: 0,
                duration: 500
            });
            
        }
        
        finalAnimation(){
            this.tweens.add({
                targets: this.logo,
                alpha: 1,
                duration: 500,
                onComplete: () => {
                    this.scene.start('RetroGamesFrameScene');
                }
            });
        }

        skyAnimation(){
            this.tweens.add({
                targets: this.sky,
                x: this.sky.x-400,
                //alpha: 0,
                duration: 1000,
                ease: 'Power2'
            });
            this.tweens.add({
                targets: this.sky,
                alpha: 0,
                duration: 700,
                ease: 'Sine.In'
            });
        }
}


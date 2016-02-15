var spritesheets = require('./spritesheets.js');

var SPEED = 350;
var JUMP_SPEED = 850;
var POWERUP  = {
  NONE: 0,
  SHIELD: 1,
  BLINK: 2
};
var BLINK_DISTANCE = 100;

// In seconds
// NOTE: Last half second of the shield will start fading out
var SHIELD_TIME = 2;

//Entire duration of poof (in seconds)
var POOF_TIME = 0.35;

class Ape extends Phaser.Sprite {
  constructor(game, x, y, name) {
    super(game, x, y, spritesheets.ape.name);
    game.add.existing(this);

    this.anchor.setTo(0.5, 0.5);
    this.animations.add('walk', [0, 1], 10, true);
    this.animations.add('jump', [4, 5], 10, true);

    // Movement
    this.leftDownTime = -1;
    this.rightDownTime = -1;

    // Physics
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = true;

    //Input
    var zButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    zButton.onDown.add(this.powerup,this);

    // Name tag
    var style = { font: "18px Arial", fill: "#000", align: "center" }
    this.nametag = game.add.text(0, -40, name, style);
    this.nametag.anchor.set(0.5);

    this.addChild(this.nametag);

    //Powerups
    this.powerupActive = false;
    this.currentPowerup = POWERUP.SHIELD;

    //Life
    this.isDead = false;
  }

  moveLeft() {
    this.body.velocity.x = -SPEED;
    this.scale.x = -1;
    this.nametag.scale.x = -1;
    this.animations.play('walk');
  }

  moveRight() {
    this.body.velocity.x = SPEED;
    this.scale.x = 1;
    this.nametag.scale.x = 1;
    this.animations.play('walk');
  }

  stop() {
    this.body.velocity.x = 0;

    if (this.body.onFloor()) {
      this.frame = 3;
      this.animations.stop();
    } else {
      this.animations.play('jump');
    }
  }

  jump() {
    this.animations.play('jump');
    if (this.body.onFloor()) {
      this.body.velocity.y = -JUMP_SPEED;
    }
  }

  powerup() {
    switch(this.currentPowerup){
      case POWERUP.SHIELD:
        if (!this.powerupActive) {
          this.powerupActive = true;

          var shieldImage = this.addChild(this.game.add.image(-32,-32, 'shield')); //TODO magic #
          this.game.time.events.add((Phaser.Timer.SECOND * SHIELD_TIME) - Phaser.Timer.HALF, function() {
            // Make the shield fade out during last half second
            var tween = this.game.add.tween(shieldImage).to( { alpha: 0 }, Phaser.Timer.HALF, Phaser.Easing.Linear.None, true, 0, 0, false);

            tween.onStart.add(function() { console.log('start'); }, this);
            tween.onComplete.add(function() {
              shieldImage.destroy();
              this.powerupActive = false;
            }, this);
          }, this);
        }
        break;
      case POWERUP.BLINK:
        //Poof!
        var littlePoof = this.game.add.sprite(this.x - 32, this.y - 32, 'misc_spritesheet');
        littlePoof.frame = 12;
        var bigPoof = this.game.add.sprite(this.x - 32, this.y - 32,'misc_spritesheet');
        bigPoof.frame = 13;

        var bigPoofTween = this.game.add.tween(bigPoof).to({alpha: 0}, (Phaser.Timer.SECOND * POOF_TIME/2), Phaser.Easing.Linear.None,false, 0, 0, false);
        var littlePoofTween = this.game.add.tween(littlePoof).to({alpha:0}, (Phaser.Timer.SECOND * POOF_TIME/2), Phaser.Easing.Linear.None,true, 0, 0, false);
        this.game.time.events.add((Phaser.Timer.SECOND * POOF_TIME/2), function() {
          bigPoofTween.start();
          bigPoofTween.onComplete.add(function(){
            bigPoof.destroy();
            littlePoof.destroy();
          });
        });

        //Raycast and determine future location
        var gameMap = this.game.getMap();
        var blinkRay = new Phaser.Line();
        blinkRay.start.set(this.x, this.y);
        blinkRay.end.set(this.x + BLINK_DISTANCE*this.scale.x, this.y);
        var collidedTiles = gameMap.createdLayers['main'].getRayCastTiles(blinkRay, 4, true);
        if(collidedTiles.length){
          if(this.scale.x === 1){
            this.x = collidedTiles[0].worldX - this.width/2;
          } else {
            this.x = collidedTiles[collidedTiles.length-1].worldX + collidedTiles[collidedTiles.length-1].width - this.width/2;
          }
        } else {
          this.x += BLINK_DISTANCE * this.scale.x;
        }

        //Move the big poof
        bigPoof.x = (this.x-32 + bigPoof.x)/2;
        break;
      default:
        break;
    }
  }

  grabPowerup(powerupName){
    var newPowerup = POWERUP[powerupName];
    if(!newPowerup) return;

    this.currentPowerup = newPowerup;
  }

  die() {
    this.rotation = 1.5;
    this.isDead = true;
  }

  update(cursors) {
    if (!cursors) return;

    //Do nothing if dead
    if(this.isDead) return;

    if (!cursors.left.isDown) {
      this.leftDownTime = -1;
    }

    if (!cursors.right.isDown) {
      this.rightDownTime = -1;
    }

    if (cursors.left.isDown && this.leftDownTime === -1) {
      this.leftDownTime = this.rightDownTime + 1;
    }

    if (cursors.right.isDown && this.rightDownTime === -1) {
      this.rightDownTime = this.leftDownTime + 1;
    }

    if (this.leftDownTime != -1 || this.rightDownTime != -1) {
      if (this.leftDownTime > this.rightDownTime) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
    } else {
      this.stop();
    }

    if (cursors.up.isDown) {
      this.jump();
    }
  }
}

module.exports = Ape;

var SPEED = 350;
var JUMP_SPEED = 850;
var POWERUP  = {
  NONE: 0,
  SHIELD: 1
};

// In seconds
// NOTE: Last half second of the shield will start fading out
var SHIELD_TIME = 2;

class Ape extends Phaser.Sprite {
  constructor(game, x, y, name) {
    super(game, x, y, 'ape');
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
    this.nametag = game.add.text(0, 0, name, style);
    this.nametag.y = -40;
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

          var shieldImage = this.addChild(this.game.add.image(-30, -30, 'shield'));
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
      default:
        break;
    }
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

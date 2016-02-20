var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');

var SPEED = config.APE.SPEED;
var JUMP_SPEED = config.APE.JUMP_SPEED;

var POWERUPS = config.APE.POWERUPS;
var POWERUP = config.APE.POWERUP;

// In seconds
// NOTE: Last half second of the shield will start fading out
var SHIELD_TIME = config.APE.SHIELD_TIME;

//Entire duration of poof (in seconds)
var POOF_TIME = 0.35;

class BaseApe extends Phaser.Sprite {
  constructor(game, x, y, name) {
    super(game, x, y, spritesheets.ape.name);
    game.add.existing(this);

    // Sprite
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('walk', [0, 1], 10, true);
    this.animations.add('jump', [4, 5], 10, true);

    // Physics
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    // Name tag
    var style = { font: "18px Arial", fill: "#000", align: "center" }
    this.nametag = game.add.text(0, -40, name, style);
    this.nametag.anchor.set(0.5);
    this.addChild(this.nametag);

    // Powerups
    this.shieldActive = false;

    this.powerupInventory = {};
    for (var key in POWERUPS) {
      var powerup = POWERUPS[key];
      this.powerupInventory[key] = powerup.INITIAL_QUANTITY;
    }

    //Life
    this.isDead = false;
  }

  // Override
  // Called upon level change
  refresh() {
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

    if (this.body.onFloor() || this.body.touching.down) {
      this.frame = 3;
      this.animations.stop();
    } else {
      this.animations.play('jump');
    }
  }

  jump() {
    this.animations.play('jump');

    if (this.body.onFloor() || this.body.touching.down) {
      this.body.velocity.y = -JUMP_SPEED;
    }
  }

  die(causeOfDeath) {
    if (!this.isInvincible()) {
      this.body.velocity.x = 0;
      this.animations.play('jump');
      this.rotation = 1.5;
      this.isDead = true;
      this.causeOfDeath = causeOfDeath;
      return true;
    } else {
      return false;
    }
  }

  update() {
    //Do nothing if dead
    if(this.isDead) return;

    if (!this.leftKey.isDown) {
      this.leftDownTime = -1;
    }

    if (!this.rightKey.isDown) {
      this.rightDownTime = -1;
    }

    if (this.leftKey.isDown && this.leftDownTime === -1) {
      this.leftDownTime = this.rightDownTime + 1;
    }

    if (this.rightKey.isDown && this.rightDownTime === -1) {
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

    if (this.jumpKey.isDown) {
      this.jump();
    }
  }

  // @param duration (int in s)
  shieldAnimation(duration, callback, callbackContext) {
    // Display bubble
    var shieldImage = this.addChild(this.game.add.image(-32,-32, spritesheets.shield.name));

    // Remove bubble
    this.game.time.events.add((Phaser.Timer.SECOND * duration) - Phaser.Timer.HALF, function() {
      // Make the shield fade out during last half second
      var tween = this.game.add.tween(shieldImage).to( { alpha: 0 }, Phaser.Timer.HALF, Phaser.Easing.Linear.None, true, 0, 0, false);

      tween.onComplete.add(function() {
        shieldImage.destroy();

        if (callback) {
          if (callbackContext) {
            callback.call(callbackContext);
          } else {
            callback();
          }
        }
      }, this);
    }, this);
  }

  blinkAnimation(oldX, oldY, newX, newY) {
    //Poof!
    var littlePoof = this.game.add.sprite(oldX, this.y, spritesheets.misc.name);
    littlePoof.anchor.setTo(0.5);
    littlePoof.frame = 12;
    var bigPoof = this.game.add.sprite((newX + oldX) / 2, this.y, spritesheets.misc.name);
    bigPoof.anchor.setTo(0.5);
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
  }
}

module.exports = BaseApe;

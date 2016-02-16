var spritesheets = require('./util/spritesheets.js');
var config = require('./util/config.js');

var ApeHUD = require('./apehud.js');

var SPEED = config.APE.SPEED;
var JUMP_SPEED = config.APE.JUMP_SPEED;

var POWERUPS = config.APE.POWERUPS;
var POWERUP = config.APE.POWERUP;

var BLINK_DISTANCE = config.APE.BLINK_DISTANCE;

// In seconds
// NOTE: Last half second of the shield will start fading out
var SHIELD_TIME = config.APE.SHIELD_TIME;

//Entire duration of poof (in seconds)
var POOF_TIME = 0.35;

class Ape extends Phaser.Sprite {
  constructor(game, x, y, name) {
    super(game, x, y, spritesheets.ape.name);
    game.add.existing(this);

    // Sprite
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('walk', [0, 1], 10, true);
    this.animations.add('jump', [4, 5], 10, true);

    // Movement
    this.leftDownTime = -1;
    this.rightDownTime = -1;

    // Physics
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = true;

    // Input
    this.jumpKey = game.input.keyboard.addKey(config.APE.CONTROLS.JUMP.BUTTON);
    this.leftKey = game.input.keyboard.addKey(config.APE.CONTROLS.LEFT.BUTTON);
    this.rightKey = game.input.keyboard.addKey(config.APE.CONTROLS.RIGHT.BUTTON);
    this.blinkKey = game.input.keyboard.addKey(config.APE.CONTROLS.BLINK.BUTTON);
    this.shieldKey = game.input.keyboard.addKey(config.APE.CONTROLS.SHIELD.BUTTON);

    this.buttons = {
      'JUMP': this.jumpKey,
      'LEFT': this.leftKey,
      'RIGHT': this.rightKey,
      'BLINK': this.blinkKey,
      'SHIELD': this.shieldKey
    }

    // Bind powerup keys
    this.blinkKey.onDown.add(this.powerup, this, 0, 'BLINK');
    this.shieldKey.onDown.add(this.powerup, this, 0, 'SHIELD');

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

    this.refresh();
  }

  // Rebuild after world clear
  refresh() {
    this.hud = new ApeHUD(this.game, this.powerupInventory, this.buttons);
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

  isInvincible() {
    return this.shieldActive;
  }

  // @param requestedPowerup (POWERUP enum)
  powerup(key, requestedPowerup) {
    if (this.isDead) return;

    switch(requestedPowerup){
      case 'SHIELD':

        if (!this.shieldActive && this.powerupInventory.SHIELD > 0) {
          // Use a shield
          this.hud.updatePowerupLegend(
              'SHIELD',
              --this.powerupInventory.SHIELD
              );

          // Flag
          this.shieldActive = true;

          // Display bubble
          var shieldImage = this.addChild(this.game.add.image(-32,-32, 'shield')); //TODO magic #

          // Remove bubble
          this.game.time.events.add((Phaser.Timer.SECOND * SHIELD_TIME) - Phaser.Timer.HALF, function() {
            // Make the shield fade out during last half second
            var tween = this.game.add.tween(shieldImage).to( { alpha: 0 }, Phaser.Timer.HALF, Phaser.Easing.Linear.None, true, 0, 0, false);

            tween.onComplete.add(function() {
              shieldImage.destroy();
              this.shieldActive = false;
            }, this);
          }, this);
        }
        break;
      case 'BLINK':
        if (this.powerupInventory.BLINK > 0) {
          // Use a blink
          this.hud.updatePowerupLegend(
              'BLINK',
              --this.powerupInventory.BLINK
              );

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
          //collidedTiles.append(gameMap.createdLayers['colli'])
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
        }
        break;
      default:
        break;
    }
  }

  grabPowerup(powerupName, quantity){
    if (!(powerupName in POWERUPS)) {
      console.warn("Invalid powerup name: " + powerupName);
      return;
    }

    this.powerupInventory[powerupName] += quantity
    this.hud.updatePowerupLegend(
        powerupName,
        this.powerupInventory[powerupName]
        );
  }

  die() {
    if (!this.isInvincible()) {
      this.body.velocity.x = 0;
      this.animations.play('jump');
      this.rotation = 1.5;
      this.isDead = true;
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
}

module.exports = Ape;

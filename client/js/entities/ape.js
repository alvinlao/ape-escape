var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

var BaseApe = require('./baseape.js');
var ApeHUD = require('./apehud.js');

var POWERUPS = config.APE.POWERUPS;
var POWERUP = config.APE.POWERUP;

var BLINK_DISTANCE = config.APE.BLINK_DISTANCE;

// In seconds
// NOTE: Last half second of the shield will start fading out
var SHIELD_TIME = config.APE.SHIELD_TIME;

//Entire duration of poof (in seconds)
var POOF_TIME = 0.35;

class Ape extends BaseApe {
  constructor(game, x, y, name) {
    super(game, x, y, name);

    // Input
    this.jumpKey = game.input.keyboard.addKey(config.APE.CONTROLS.JUMP.BUTTON);
    this.leftKey = game.input.keyboard.addKey(config.APE.CONTROLS.LEFT.BUTTON);
    this.rightKey = game.input.keyboard.addKey(config.APE.CONTROLS.RIGHT.BUTTON);
    this.blinkKey = game.input.keyboard.addKey(config.APE.CONTROLS.BLINK.BUTTON);
    this.shieldKey = game.input.keyboard.addKey(config.APE.CONTROLS.SHIELD.BUTTON);

    // Bind powerup keys
    this.blinkKey.onDown.add(this.powerup, this, 0, 'BLINK');
    this.shieldKey.onDown.add(this.powerup, this, 0, 'SHIELD');

    this.buttons = {
      'JUMP': this.jumpKey,
      'LEFT': this.leftKey,
      'RIGHT': this.rightKey,
      'BLINK': this.blinkKey,
      'SHIELD': this.shieldKey
    }

    this.refresh();
  }

  // Rebuild after world clear
  refresh() {
    console.log(this.buttons);
    this.hud = new ApeHUD(this.game, this.powerupInventory, this.buttons);
  }

  isInvincible() {
    return this.shieldActive;
  }

  // @param requestedPowerup (POWERUP enum)
  powerup(key, requestedPowerup) {
    if (this.isDead) return;
    this.game.socket.emit("powerup",requestedPowerup);

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

  broadcastKeys(){
    this.game.socket.emit("move",{
      jumpKey: this.jumpKey.isDown,
      leftKey: this.leftKey.isDown,
      rightKey: this.rightKey.isDown,
      blinkKey: this.blinkKey.isDown,
      shieldKey: this.shieldKey.isDown
    });
  }

  update() {
    this.broadcastKeys();
    super.update();
  }
}

module.exports = Ape;

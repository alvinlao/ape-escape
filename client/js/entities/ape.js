var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

var BaseApe = require('./baseape.js');
var ApeHUD = require('../components/apehud.js');

var POWERUPS = config.APE.POWERUPS;
var POWERUP = config.APE.POWERUP;

var BLINK_DISTANCE = config.APE.BLINK_DISTANCE;
var SHIELD_TIME = config.APE.SHIELD_TIME;

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
    var poweruphandler = function(key, requestedPowerup) {
      this.powerup(requestedPowerup);
    }

    this.blinkKey.onDown.add(poweruphandler, this, 0, 'BLINK');
    this.shieldKey.onDown.add(poweruphandler, this, 0, 'SHIELD');

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
    this.hud = new ApeHUD(this.game, this.powerupInventory, this.buttons);
  }

  isInvincible() {
    return this.shieldActive;
  }

  // @param requestedPowerup (POWERUP enum)
  powerup(requestedPowerup) {
    if (this.isDead) return;

    switch(requestedPowerup){
      case 'SHIELD':
        if (!this.shieldActive && this.powerupInventory.SHIELD > 0) {
          var duration = SHIELD_TIME;
          this.game.ape.onPowerup.dispatch(requestedPowerup, { duration: duration });

          // Use a shield
          this.hud.updatePowerupLegend(
              'SHIELD',
              --this.powerupInventory.SHIELD
              );

          // Flag
          this.shieldActive = true;
          this.shieldAnimation(duration, function() {
            this.shieldActive = false;
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

          // Save for animation
          var oldX = this.x;
          var oldY = this.y;

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

          this.game.ape.onPowerup.dispatch(requestedPowerup, { oldX: oldX, oldY: oldY, newX: this.x, newY: this.y });

          // Animate
          this.blinkAnimation(oldX, oldY, this.x, this.y);
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

  die(causeOfDeath) {
    if (!this.isInvincible() && !this.isDead) {
      super.die(causeOfDeath);

      this.game.ape.onDeath.dispatch(causeOfDeath);
      return true;
    } else {
      return false;
    }
  }

  update() {
    this.game.ape.onUpdate.dispatch({
      jumpKey: this.jumpKey.isDown,
      leftKey: this.leftKey.isDown,
      rightKey: this.rightKey.isDown,
      blinkKey: this.blinkKey.isDown,
      shieldKey: this.shieldKey.isDown
    });
    super.update();
  }
}

module.exports = Ape;

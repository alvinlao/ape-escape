var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

var BaseApe = require('./baseape.js');

var RemoteApeHUD = require('../components/remoteapehud.js');

class RemoteApe extends BaseApe {
  constructor(game, x, y, name) {
    super(game, x, y, name);

    // TODO: Better movement (not mirror)
    this.jumpKey = {isDown: false};
    this.leftKey = {isDown: false};
    this.rightKey = {isDown: false};
    this.blinkKey = {isDown: false};
    this.shieldKey = {isDown: false};

    // Server instructions
    this.game.ape.onUpdate.add(function (keys) {
      this.jumpKey.isDown = keys.jumpKey;
      this.leftKey.isDown = keys.leftKey;
      this.rightKey.isDown = keys.rightKey;
      this.blinkKey.isDown = keys.blinkKey;
      this.shieldKey.isDown = keys.shieldKey;
      this.update();
    }, this);

    this.game.ape.onDeath.add(function (causeOfDeath) {
      this.die(causeOfDeath);
    }, this);

    this.game.ape.onWin.add(function(){
      //Ape wins
      console.log("Ape won!");
    }, this);
    
    this.game.ape.onPowerup.add(function (powerup, powerupArgs) {
      this.powerup(powerup, powerupArgs);
      this.hud.updatePowerupLegend(powerup, --this.powerupInventory[powerup]);
    }, this);

    this.game.ape.onGrabPowerup.add(function (powerupid, quantity) {
      var type = this.game.ape.powerups[powerupid].type
        this.powerupInventory[type] += quantity;
      this.hud.updatePowerupLegend(type, this.powerupInventory[type]);
    }, this);

    this.refresh();
  }

  refresh() {
    this.hud = new RemoteApeHUD(this.game, this.powerupInventory);
  }

  powerup(requestedPowerup, powerupArgs) {
    switch (requestedPowerup) {
      case 'SHIELD':
        var args = [
          powerupArgs.duration
        ];

        this.shieldAnimation.apply(this, args);
        break;
      case 'BLINK':
        var args = [
          powerupArgs.oldX,
          powerupArgs.oldY,
          powerupArgs.newX,
          powerupArgs.newY
        ];

        this.x = powerupArgs.newX;
        this.y = powerupArgs.newY;

        this.blinkAnimation.apply(this, args);
        break;
      default:
        console.warn("Invalid requested powerup: " + requestedPowerup);
        break;
    }
  }
}

module.exports = RemoteApe;

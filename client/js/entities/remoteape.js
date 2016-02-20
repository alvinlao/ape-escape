var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

var BaseApe = require('./baseape.js');

class RemoteApe extends BaseApe {
  constructor(game, x, y, name) {
    super(game, x, y, name);

    // TODO: Better movement (not mirror)
    this.jumpKey = {isDown: false};
    this.leftKey = {isDown: false};
    this.rightKey = {isDown: false};
    this.blinkKey = {isDown: false};
    this.shieldKey = {isDown: false};

    var self = this;
    game.socket.on("ape:move", function(keys){
      self.jumpKey.isDown = keys.jumpKey;
      self.leftKey.isDown = keys.leftKey;
      self.rightKey.isDown = keys.rightKey;
      self.blinkKey.isDown = keys.blinkKey;
      self.shieldKey.isDown = keys.shieldKey;
      self.update();
    });

    game.socket.on("powerup", function(type){
      self.powerup(null, type);
    });
  }

  powerup(requestedPowerup) {
    var args = arguments.splice(0, 1);

    switch (requestedPowerup) {
      case 'SHIELD':
        this.shieldAnimation(args);
        break;
      case 'BLINK':
        this.blinkAnimation(args);
        break;
      default:
        console.warn("Invalid requested powerup: " + requestedPowerup);
        break;
    }
  }
}

module.exports = RemoteApe;

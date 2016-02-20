var BaseApeHUD = require('./baseapehud.js');

class RemoteApeHUD extends BaseApeHUD {
  constructor(game, powerupInventory) {
    super(game);
    game.add.existing(this);

    this.createPowerupLegend(powerupInventory, false);
  }
}

module.exports = RemoteApeHUD;

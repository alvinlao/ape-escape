var spritesheets = require('../spritesheets.js');
var TrapActivator = require('./trapactivator.js');
var FireTrap = require('./firetrap.js');

class FireTrapActivator extends TrapActivator {
  constructor(game, x, y, numPlayers) {
    super(game, x, y, 4, numPlayers);
  }

  activate() {
    var firetrap = new FireTrap(this.game, this.x, this.y);
    firetrap.activate();
  }
}

module.exports = FireTrapActivator;

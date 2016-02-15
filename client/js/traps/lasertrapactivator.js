var spritesheets = require('../spritesheets.js');
var TrapActivator = require('./trapactivator.js');
var LaserTrap = require('./lasertrap.js');

class LaserTrapActivator extends TrapActivator {
  constructor(game, x, y, numPlayers) {
    super(game, x, y, 5, numPlayers);

    this.lasertrap = new LaserTrap(game, x, y);
  }

  activate() {
    super.activate();
  }
}

module.exports = LaserTrapActivator;

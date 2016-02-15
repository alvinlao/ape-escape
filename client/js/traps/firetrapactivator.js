var TrapActivator = require('./trapactivator.js');

class FireTrapActivator extends TrapActivator {
  constructor(game, x, y, numPlayers) {
    super(game, x, y, 4, numPlayers);
  }
}

module.exports = FireTrapActivator;

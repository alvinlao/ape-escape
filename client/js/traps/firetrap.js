var Trap = require('./trap.js');

class FireTrap extends Trap {
  constructor(game, x, y, numPlayers) {
    super(game, x, y, 4, numPlayers);
  }
}

module.exports = FireTrap;

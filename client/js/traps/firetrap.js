var Trap = require('./trap.js');

class FireTrap extends Trap {
  constructor(game, x, y) {
    super(game, x, y, 4);
  }
}

module.exports = FireTrap;

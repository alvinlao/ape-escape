var spritesheets = require('../util/spritesheets.js');
var TrapActivator = require('./trapactivator.js');
var DropTrap = require('./droptrap.js');

class DropTrapActivator extends TrapActivator {
  constructor(game, x, y, numPlayers) {
    super(game, x, y, 5, numPlayers);

    this.droptrap = new DropTrap(game, x, y);
  }

  activate() {
    super.activate();

    this.visible = false;
    this.droptrap.activate();
  }
}

module.exports = DropTrapActivator;

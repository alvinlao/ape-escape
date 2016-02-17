var spritesheets = require('../util/spritesheets.js');
var TrapActivator = require('./trapactivator.js');
var DropTrap = require('./droptrap.js');

class DropTrapActivator extends TrapActivator {
  constructor(game, x, y, numPlayers) {
    // this goes before for render order
    var droptrap = new DropTrap(game, x, y);

    super(game, x, y, 5, numPlayers);

    this.trap = droptrap;
  }

  activate() {
    super.activate();

    this.visible = false;
  }
}

module.exports = DropTrapActivator;

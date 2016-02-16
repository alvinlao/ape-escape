var spritesheets = require('../util/spritesheets.js');

var TrapActivator = require('./trapactivator.js');
var FireTrap = require('./firetrap.js');

class FireTrapActivator extends TrapActivator {
  constructor(game, x, y, numPlayers) {
    super(game, x, y, 4, numPlayers);
    this.firetrap = new FireTrap(this.game, this.x, this.y);
  }

  activate() {
    super.activate();

    this.firetrap.activate();
  }
}

module.exports = FireTrapActivator;

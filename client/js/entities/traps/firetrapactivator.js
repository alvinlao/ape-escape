var spritesheets = require('../../util/spritesheets.js');

var TrapActivator = require('./trapactivator.js');
var FireTrap = require('./firetrap.js');

class FireTrapActivator extends TrapActivator {
  constructor(game, x, y) {
    super(game, x, y, 4);
    this.trap = new FireTrap(this.game, this.x, this.y);
  }
}

module.exports = FireTrapActivator;

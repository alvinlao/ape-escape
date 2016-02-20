var config = require('../../util/config.js');
var spritesheets = require('../../util/spritesheets.js');

var TrapActivator = require('./trapactivator.js');
var LaserTrap = require('./lasertrap.js');

class LaserTrapActivator extends TrapActivator {
  constructor(game, x, y, numPlayers, direction, length) {
    var spriteIndex;
    switch (direction) {
      case 'left':
        spriteIndex = 0;
        break;
      case 'right':
        spriteIndex = 1;
        break;
      case 'up':
        spriteIndex = 2;
        break;
      case 'down':
        spriteIndex = 3;
        break;
      default:
        console.warn("Invalid laser direction: " + direction);
        break;
    }

    super(game, x, y, spriteIndex, numPlayers);

    this.trap = new LaserTrap(game, x, y, direction, length);
  }

}

module.exports = LaserTrapActivator;

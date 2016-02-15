var Trap = require('./trap.js');
var config = require('../config.js');

var FIRE_DURATION = config.TRAPS.FIRE.DURATION;

class FireTrap extends Trap {
  constructor(game, x, y) {
    super(game, x, y - 64);

    this.animations.add('fire', [8, 9, 10, 11], 10, true);
  }

  // @param forever (bool) = keep fire alive forever
  activate(forever) {
    super.activate();

    this.animations.play('fire');

    if (typeof forever !== 'undefined' && forever) return;

    this.game.time.events.add(
        Phaser.Timer.SECOND * FIRE_DURATION,
        function () {
          this.animations.stop();
          this.deactivate();
          this.visible = false;
        },
        this);
  }
}

module.exports = FireTrap;

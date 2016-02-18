var config = require('../util/config.js');

var Trap = require('./trap.js');

var FIRE_DURATION = config.TRAPS.FIRE.DURATION;

class FireTrap extends Trap {
  constructor(game, x, y) {
    super(game, x, y - 64);

    this.animations.add('fire', [8, 9, 10, 11], 10, true);
  }

  activate(remote) {
    super.activate(remote);

    this.animations.play('fire');

    this.game.time.events.add(
        Phaser.Timer.SECOND * FIRE_DURATION,
        function () {
          this.animations.stop();
          this.deactivate();
          this.visible = false;
        },
        this);
  }

  getDeathMessage() {
    return config.APE.DEATH.FIRE;
  }
}

module.exports = FireTrap;

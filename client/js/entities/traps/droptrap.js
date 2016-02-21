var config = require('../../util/config.js');

var Trap = require('./trap.js');

class DropTrap extends Trap {
  constructor(game, x, y) {
    super(game, x, y);

    this.visible = true;
    this.frame = 15;

    this.body.immovable = true;
    this.checkWorldBounds = true;

    game.getDropTraps().push(this);

    this.active = false;
  }

  activate(remote) {
    super.activate(remote);

    this.active = true;
    this.body.allowGravity = true;

    this.events.onOutOfBounds.add(function() {
      this.deactivate();
    }, this);
  }

  deactivate() {
    if (!this.active) return;

    this.active = false;
    super.deactivate(false);
  }

  getDeathMessage() {
    return 'DROP';
  }
}

module.exports = DropTrap;


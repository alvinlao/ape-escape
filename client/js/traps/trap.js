var spritesheets = require('../util/spritesheets.js');

class Trap extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, spritesheets.misc.name);
    game.add.existing(this);

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.allowGravity = false;

    this.visible = false;
    this.killedPlayer = false;
  }

  // @param remote (boolean)
  activate(remote) {
    this.visible = true;
    if (typeof remote === 'undefined') {
      this.remote = false;
    } else {
      this.remote = remote;
    }

    if (!this.remote) {
      this.game.getActiveTraps().push(this);
    }
  }

  deactivate(destroy) {
    if (typeof destroy === 'undefined') {
      destroy = true;
    }

    if (!this.remote) {
      var activeTraps = this.game.getActiveTraps();
      var i = activeTraps.indexOf(this);
      activeTraps.splice(i, 1);
    }

    if (destroy) {
      this.destroy();
    }
  }

  getDeathMessage() {
    return "You are dead";
  }
}

module.exports = Trap;

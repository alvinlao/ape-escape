var spritesheets = require('../spritesheets.js');

class Trap extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, spritesheets.misc.name);
    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.allowGravity = false;
  }

  activate() {
    this.game.getActiveTraps().add(this);
  }

  deactivate() {
    this.game.getActiveTraps().remove(this);
  }
}

module.exports = Trap;

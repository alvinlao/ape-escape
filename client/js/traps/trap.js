var spritesheets = require('../util/spritesheets.js');

class Trap extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, spritesheets.misc.name);
    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.visible = false;

    this.body.allowGravity = false;
  }

  activate() {
    this.visible = true;
    this.game.getActiveTraps().add(this);
  }

  deactivate() {
    this.game.getActiveTraps().remove(this, true);
  }
}

module.exports = Trap;

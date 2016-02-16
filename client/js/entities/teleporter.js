var spritesheets = require('../util/spritesheets.js');

class Teleporter extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, spritesheets.misc.name);
    game.add.existing(this);

    this.animations.add('wait', [16, 17, 18, 19], 8, true);
    this.animations.add('go', [20, 21, 22, 23], 8, true);

    this.animations.play('wait');
  }

  go() {
    this.animations.stop();
    this.animations.play('go');
  }
}

module.exports = Teleporter;

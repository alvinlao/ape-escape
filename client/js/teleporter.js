var spritesheets = require('./spritesheets.js');

class Teleporter extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, spritesheets.misc.name);
    game.add.existing(this);
    
    this.animations.add('wait', [16, 17, 18], 5, true);
    this.animations.play('wait');
  }
}

module.exports = Teleporter;

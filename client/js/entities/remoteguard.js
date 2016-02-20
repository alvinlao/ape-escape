var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');

class RemoteGuard extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, spritesheets.guardpointer.name);
    game.add.existing(this);
  }

  // @param delta (int in ms) time delta
  moveTo(x, y, delta) {
    if (this.tween) this.tween.stop();

    this.tween = this.game.add.tween(this).to( { x: x, y: y }, delta, Phaser.Easing.Linear.None, true, 0, 0);
  }
}

module.exports = RemoteGuard;

var spritesheets = require('../../util/spritesheets.js');

class LaserHead extends Phaser.Sprite {
  constructor(game, x, y, angle) {
    super(game, x, y, spritesheets.misc.name);
    game.add.existing(this);

    this.animations.add('active', [4, 5, 6, 7], 10, true);
    this.anchor.setTo(0.5);
    this.angle += angle + 90;
  }

  activate() {
    this.animations.play('active');
  }

  deactivate() {
    this.animations.stop();
    this.visible = false;
    this.destroy();
  }
}

module.exports = LaserHead;

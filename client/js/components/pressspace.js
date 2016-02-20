var spritesheets = require('../util/spritesheets.js');

var Button = require('./button.js');

class PressSpace extends Button {
  constructor(game, x, y, callback, callbackContext) {
    super(game, x, y, spritesheets.spacebar.name, [Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.ENTER], callback, callbackContext);
    game.add.existing(this);

    this.callback = callback;
    this.callbackContext = callbackContext;

    // Animated space bar
    this.anchor.setTo(0.5);
    this.animations.add('tap', [0, 1], 2, true);
    this.animations.play('tap');
  }

  down() {
    super.down();
    this.animations.stop();
  }

  up() {
    super.up();

    // Only allow press down once
    this.disableKeyboard();
  }

  disableSpaceOnly() {
    this.disableKeyboard(Phaser.KeyCode.SPACEBAR);
  }
}

module.exports = PressSpace;

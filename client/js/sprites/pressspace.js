var spritesheets = require('../util/spritesheets.js');

class PressSpace extends Phaser.Sprite {
  constructor(game, x, y, callback, callbackContext) {
    super(game, x, y, spritesheets.spacebar.name);
    game.add.existing(this);

    this.callback = callback;
    this.callbackContext = callbackContext;

    // Animated space bar
    this.anchor.setTo(0.5);
    this.animations.add('tap', [0, 1], 2, true);
    this.animations.play('tap');

    // Listen for input
    game.input.keyboard.addKeyCapture(Phaser.KeyCode.SPACEBAR);
    this.spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    this.spacebar.onDown.add(this.down, this, 0);
    this.spacebar.onUp.add(this.up, this, 0);
  }

  down() {
    this.animations.stop();
    this.frame = 1;

    // Unbind
    this.spacebar.onDown.remove(this.down, this);
  }

  up() {
    this.frame = 0;
    this.spacebar.onUp.remove(this.up, this);

    this.game.time.events.add(Phaser.Timer.HALF, function() {
      this.callback.call(this.callbackContext);
    }, this);
  }
}

module.exports = PressSpace;

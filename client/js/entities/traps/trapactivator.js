var spritesheets = require('../../util/spritesheets.js');

class TrapActivator extends Phaser.Sprite {
  constructor(game, x, y, trapSpriteIndex) {
    super(game, x, y, spritesheets.traps.name);
    game.add.existing(this);

    // Choose frame from spritesheet
    this.frame = trapSpriteIndex;

    // Enable input
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.events.onInputDown.add(this.click, this);

    // Activation
    this.clicksLeft = 0;

    // Activation draw
    var style = { font: "14px Arial", fill: "#562e03" };
    this.clicksLeftText = game.add.text(4, 6, this.clicksLeft, style);
    this.addChild(this.clicksLeftText);

    // Listen to trap manager
    this.game.traps.onUpdate.add(function(traps) {
      if (this.id in traps) {
        this.clicksLeft = traps[this.id].clicksLeft;
        this.clicksLeftText.text = this.clicksLeft;
      }
    }, this);
  }

  // TODO: Send to server and let it decide
  click() {
    if (this.clicksLeft > 0) {
      this.clicksLeft--;
      this.clicksLeftText.text = this.clicksLeft;

      this.game.traps.onClick.dispatch(this.id);
    }
  }

  updateClicksLeft(clicksLeft) {
    this.clicksLeft = clicksLeft;
    this.clicksLeftText.text = this.clicksLeft;
  }

  // Override
  activate() {
    this.alpha = 0.4;
    this.trap.activate(true);
  }
}

module.exports = TrapActivator;

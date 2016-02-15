var spritesheets = require('../spritesheets.js');

class TrapActivator extends Phaser.Sprite {
  constructor(game, x, y, trapSpriteIndex, numPlayers) {
    super(game, x, y, spritesheets.traps.name);
    game.add.existing(this);

    // Choose frame from spritesheet
    this.frame = trapSpriteIndex;

    // Activation
    this.clicksLeft = this.calculateClicks(numPlayers);

    // Activation draw
    var style = { font: "14px Arial", fill: "#562e03" };
    this.clicksLeftText = game.add.text(0, 8, this.clicksLeft, style);
    this.addChild(this.clicksLeftText);
  }

  click() {
    this.clicksLeft--;
    this.clicksLeftText.text = this.clicksLeft;
  }

  // Override
  calculateClicks(numPlayers) {
    return 10 * numPlayers;
  }
}

module.exports = TrapActivator;

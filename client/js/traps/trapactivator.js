var spritesheets = require('../spritesheets.js');

class TrapActivator extends Phaser.Sprite {
  constructor(game, x, y, trapSpriteIndex, numPlayers) {
    super(game, x, y, spritesheets.traps.name);
    game.add.existing(this);

    // Choose frame from spritesheet
    this.frame = trapSpriteIndex;

    // Enable input
    this.inputEnabled = true;
    this.input.useHandCursor = true;

    // Faster clicking
    this.events.onInputDown.add(this.click, this);

    // Activation
    this.clicksLeft = this.calculateClicks(numPlayers);

    // Activation draw
    var style = { font: "14px Arial", fill: "#562e03" };
    this.clicksLeftText = game.add.text(0, 8, this.clicksLeft, style);
    this.addChild(this.clicksLeftText);
  }

  // TODO: Send to server and let it decide
  click() {
    if (this.clicksLeft > 0) {
      this.clicksLeft--;
      this.clicksLeftText.text = this.clicksLeft;
    } 

    if (this.clicksLeft === 0) {
      this.activate();
    }
  }

  // Override
  activate() {
    this.clicksLeft--;
    this.alpha = 0.4;
  }

  // Override
  calculateClicks(numPlayers) {
    return 3 * numPlayers;
  }
}

module.exports = TrapActivator;

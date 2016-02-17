var config = require('../util/config.js');

var PressSpace = require('./pressspace.js');

class GameOver extends Phaser.Group {
  constructor(game, currentLevel, totalLevels, causeOfDeath) {
    super(game);

    if (typeof causeOfDeath === 'undefined') {
      causeOfDeath = "Game Over";
    }

    this.fixedToCamera = true;

    // Dim 
    // NOTE: Not part of the group
    var overlay = game.add.graphics(0, 0);
    overlay.beginFill(0x000000);
    overlay.alpha = 0.8;
    overlay.drawRect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT);
    this.addChild(overlay);

    var x = config.CANVAS_WIDTH / 2;
    var y = config.CANVAS_HEIGHT / 2;
    var titleYOffset = -50;
    var spaceYOffset = 50;
    var progressYOffset = 120;

    // Text
    var style = { font: "72px Arial", fill: "#ffffff", align: "center" };
    var text = game.add.text(x, y + titleYOffset, causeOfDeath, style);
    text.anchor.set(0.5);

    this.addChild(text);

    // Press space
    var pressspace = new PressSpace(game, x, y + spaceYOffset, function() {
      this.game.state.start('lobby');
    }, this);

    this.addChild(pressspace);

    // Progress
    var style = { font: "22px Arial", fill: "#b8b8b8", align: "center"};
    var progress = game.add.text(x, y + progressYOffset, currentLevel + "/" + totalLevels + " levels", style);
    progress.anchor.set(0.5);
    this.addChild(progress);

    this.alpha = 0;
    var tween = this.game.add.tween(this).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
  }
}

module.exports = GameOver;

var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

var PressSpace = require('../sprites/pressspace.js');

class TitleState extends Phaser.State {
  create() {
    super.create();

    var game = this.game;

    var x = config.CANVAS_WIDTH / 2;
    var y = config.CANVAS_HEIGHT / 2;
    var titleYOffset = -50;
    var spaceYOffset = 50;

    // Ape Escape
    var style = { font: "72px Arial", fill: "#253659", align: "center" };
    var title = game.add.text(x, y + titleYOffset, "Ape Escape", style);
    title.anchor.set(0.5);

    // Press Space
    var pressspace = new PressSpace(game, x, y + spaceYOffset, function() {
      // TODO: Go to lobby
      //this.game.state.start('lobby');
      this.game.state.start('level');
    }, this);
  }
}

module.exports = TitleState;

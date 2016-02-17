var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');

var Button = require('../sprites/button.js');

class LobbyState extends Phaser.State {
  create() {
    super.create();

    var game = this.game;

    var apebuttonwidth = 128;
    var zookeepberbuttonwidth = 256;
    var gutter = 10;
    var titleYOffset = -50;
    var buttonYOffset = 50;

    var width = apebuttonwidth + zookeepberbuttonwidth + gutter;
    var height = 64;

    var x = config.CANVAS_WIDTH / 2 - (width / 2);
    var y = config.CANVAS_HEIGHT / 2 - (height / 2) + buttonYOffset;

    // Lobby
    var style = { font: "72px Arial", fill: "#253659", align: "center" };
    var title = game.add.text(config.CANVAS_WIDTH / 2, config.CANVAS_HEIGHT / 2 + titleYOffset, "Lobby", style);
    title.anchor.set(0.5);

    // Buttons
    var apeButton = new Button(game, x, y, spritesheets.apeButton.name, Phaser.KeyCode.Z, function() {
      this.game.state.start('level');
    }, this);

    x += apebuttonwidth + gutter;

    var zooKeeperButton = new Button(game, x, y, spritesheets.zookeeperButton.name, Phaser.KeyCode.X, function() {
      this.game.state.start('level');
    }, this);
  }
}

module.exports = LobbyState;

var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');
var buttonconfig = require('../util/buttonconfig.js');

var TextButton = require('../sprites/textbutton.js');

class TitleState extends Phaser.State {
  create() {
    super.create();

    var game = this.game;

    var x = Math.floor(config.CANVAS_WIDTH / 2) + 0.5;
    var y = Math.floor(config.CANVAS_HEIGHT / 2);
    var titleYOffset = -50;
    var spaceYOffset = 80;

    // Ape Escape
    var style = { font: "72px Arial", fill: "#253659", align: "center" };
    var title = game.add.text(x, y + titleYOffset, "Ape Escape", style);
    title.anchor.set(0.5);

    // Start game
    this.startGameButton = new TextButton(
        game,
        x,
        y + spaceYOffset,
        spritesheets.bluebutton4.name,
        'enter',
        buttonconfig.BLUE_STYLE,
        Phaser.KeyCode.ENTER,
        function() {
          // Hide input
          this.nameInput.style.display = 'none';

          var name = this.nameInput.value;

          if (name === '') {
            name = config.PLAYER.DEFAULT_NAME;
          }

          this.game.playerName = name;
          this.game.socket.emit("player_name", name);

          this.game.state.start('lobby');
        },
        this
      );

    // Input
    this.nameInput = document.getElementById('name');
    this.nameInput.style.display = 'block';
    this.nameInput.focus();
  }
}

module.exports = TitleState;

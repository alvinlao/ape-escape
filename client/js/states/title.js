var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

var PressSpace = require('../sprites/pressspace.js');

class TitleState extends Phaser.State {
  shutdown() {
    this.nameInput.removeEventListener('focus', this.disableSpace);
    this.nameInput.removeEventListener('blur', this.enableSpace);
  }

  create() {
    super.create();

    var game = this.game;

    var x = config.CANVAS_WIDTH / 2;
    var y = config.CANVAS_HEIGHT / 2;
    var titleYOffset = -50;
    var spaceYOffset = 80;

    // Ape Escape
    var style = { font: "72px Arial", fill: "#253659", align: "center" };
    var title = game.add.text(x, y + titleYOffset, "Ape Escape", style);
    title.anchor.set(0.5);

    // Press Space
    this.pressspace = new PressSpace(game, x, y + spaceYOffset, function() {
      this.game.time.events.add(Phaser.Timer.HALF, function() {
        // Hide input
        this.nameInput.style.display = 'none';

        var name = this.nameInput.value;

        if (name === '') {
          name = config.PLAYER.DEFAULT_NAME;
        }

        this.game.playerName = name;
        this.game.state.start('lobby');
      }, this);
    }, this);

    // Input
    this.nameInput = document.getElementById('name');
    this.nameInput.style.display = 'block';

    // Don't capture SPACEBAR when focused on input
    this.enableSpace = (function(e) {
      this.enableKeyboard();
    }).bind(this.pressspace);

    this.disableSpace = (function(e) {
      this.disableSpaceOnly();
    }).bind(this.pressspace);


    this.nameInput.addEventListener('focus', this.disableSpace);
    this.nameInput.addEventListener('blur', this.enableSpace);

    this.nameInput.focus();
  }
}

module.exports = TitleState;

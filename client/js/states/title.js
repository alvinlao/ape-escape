var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

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

    
    // Animated space bar
    this.spacebarSprite = game.add.sprite(x, y + spaceYOffset, spritesheets.spacebar.name);
    this.spacebarSprite.anchor.setTo(0.5);
    this.spacebarSprite.animations.add('tap', [0, 1], 2, true);
    this.spacebarSprite.animations.play('tap');

    // Listen for input
    game.input.keyboard.addKeyCapture(Phaser.KeyCode.SPACEBAR);
    this.spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    this.spacebar.onDown.add(this.down, this, 0);
    this.spacebar.onUp.add(this.up, this, 0);
  }

  down() {
    this.spacebarSprite.animations.stop();
    this.spacebarSprite.frame = 1;

    // Unbind
    this.spacebar.onDown.remove(this.down, this);
  }

  up() {
    this.spacebarSprite.frame = 0;
    this.spacebar.onUp.remove(this.up, this);

    this.game.time.events.add(Phaser.Timer.HALF, function() {
      // TODO: Go to lobby
      //this.game.state.start('lobby');
      this.game.state.start('level');

    }, this);
  }
}

module.exports = TitleState;

var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

var POWERUPS = config.APE.POWERUPS;
var CONTROLS = config.APE.CONTROLS;

class BaseApeHUD extends Phaser.Group {
  constructor(game, powerupInventory) {
    super(game);
    game.add.existing(this);

    this.MARGINX = 100;   // distance from edge of screen (x)
    this.MARGINY = 20;   // distance from edge of screen (y)
    this.OFFSET = 2;     // distance from each element
    this.SCALE = 0.7;    // scale images
  }

  createPowerupLegend(powerupInventory, drawButtons) {
    var x = this.MARGINX;
    var y = config.CANVAS_HEIGHT - (config.TILE_SIZE * this.SCALE) - this.MARGINY;
    var delta = (config.TILE_SIZE * this.SCALE) + this.OFFSET;

    this.powerupLegend = {};

    for (var key in POWERUPS) {
      var powerup = POWERUPS[key];

      var powerupView = {};

      // Group together
      var powerupGroup = new Phaser.Group(this.game, this);
      powerupGroup.fixedToCamera = true;
      powerupView.group = powerupGroup;

      this.powerupLegend[key] = powerupView;

      if (drawButtons) {
        // Button icon
        powerupView.button = this.game.add.sprite(x, y, spritesheets.buttons.name, CONTROLS[key].FRAMENUMBER);
        powerupView.button.scale.x = this.SCALE;
        powerupView.button.scale.y = this.SCALE;
        powerupGroup.add(powerupView.button);
        x += delta;
      }

      // Power up icon
      powerupView.icon = this.game.add.sprite(x, y, spritesheets.misc.name, POWERUPS[key].FRAMENUMBER);
      powerupView.icon.scale.x = this.SCALE;
      powerupView.icon.scale.y = this.SCALE;
      powerupGroup.add(powerupView.icon);
      x += delta;

      // Text Counter
      var style = { font: "28px Arial", fill: "#253659", boundsAlignV: "middle" };
      powerupView.text = this.game.add.text(x, y, "", style);
      this.updatePowerupLegend(key, powerupInventory[key]);
      powerupView.text.setTextBounds(0, 0, config.TILE_SIZE, config.TILE_SIZE);
      powerupView.text.scale.x = this.SCALE;
      powerupView.text.scale.y = this.SCALE;
      powerupGroup.add(powerupView.text);

      x += delta + (2 * this.OFFSET);
    }
  }

  // @param powerupName (POWERUPS._.NAME)
  updatePowerupLegend(powerupName, numAvailable) {
    var legend = this.powerupLegend[powerupName];
    legend.text.setText("x" + numAvailable);

    var fade = 0.5;
    if (numAvailable <= 0) {
      legend.icon.alpha = fade;
      legend.text.alpha = fade;
    } else {
      legend.icon.alpha = 1;
      legend.text.alpha = 1;
    }
  }
}

module.exports = BaseApeHUD;

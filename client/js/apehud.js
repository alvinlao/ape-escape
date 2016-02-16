var spritesheets = require('./spritesheets.js');
var config = require('./config.js');

var POWERUPS = config.APE.POWERUPS;
var CONTROLS = config.APE.CONTROLS;

var MARGIN = 20;    // distance from edge of screen
var OFFSET = 2;     // distance from each element
var SCALE = 0.7;    // scale images


class ApeHUD extends Phaser.Group {
  // @param buttons (obj CONTROL => Phaser.Key)
  constructor(game, powerupInventory, buttons) {
    super(game);
    game.add.existing(this);

    this.createPowerupLegend(powerupInventory);
    this.createMovementLegend();
    this.bindButtons(buttons);
  }

  createPowerupLegend(powerupInventory) {
    var x = MARGIN;
    var y = config.CANVAS_HEIGHT - (config.TILE_SIZE * SCALE) - MARGIN;
    var delta = (config.TILE_SIZE * SCALE) + OFFSET;

    this.powerupLegend = {};

    for (var key in POWERUPS) {
      var powerup = POWERUPS[key];

      var powerupView = {};

      // Group together
      var powerupGroup = new Phaser.Group(this.game, this);
      powerupGroup.fixedToCamera = true;
      powerupView.group = powerupGroup;

      this.powerupLegend[key] = powerupView;

      // Button icon
      powerupView.button = this.game.add.sprite(x, y, spritesheets.buttons.name, CONTROLS[key].FRAMENUMBER);
      powerupView.button.scale.x = SCALE;
      powerupView.button.scale.y = SCALE;
      powerupGroup.add(powerupView.button);

      // Power up icon
      x += delta;
      powerupView.icon = this.game.add.sprite(x, y, spritesheets.misc.name, POWERUPS[key].FRAMENUMBER);
      powerupView.icon.scale.x = SCALE;
      powerupView.icon.scale.y = SCALE;
      powerupGroup.add(powerupView.icon);

      // Text Counter
      var style = { font: "28px Arial", fill: "#253659", boundsAlignV: "middle" };
      x += delta;
      powerupView.text = this.game.add.text(x, y, "", style);
      this.updatePowerupLegend(key, powerupInventory[key]);
      powerupView.text.setTextBounds(0, 0, config.TILE_SIZE, config.TILE_SIZE);
      powerupView.text.scale.x = SCALE;
      powerupView.text.scale.y = SCALE;
      powerupGroup.add(powerupView.text);

      x += delta + (2 * OFFSET);
    }
  }

  createMovementLegend() {
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

  destroy() {
    super.destroy();

    // Remove key bindings
    this.unbindButtons();
  }

  bindButtons(buttons) {
    this.buttons = buttons;

    for (var button in buttons) {
      var key = buttons[button];

      key.onDown.add(this.buttonDown, this, 0, button);
      key.onUp.add(this.buttonUp, this, 0, button);
    }
  }

  unbindButtons() {
    for (var button in this.buttons) {
      var key = this.buttons[button];

      key.onDown.remove(this.buttonDown, this);
      key.onUp.remove(this.buttonUp, this);
    }
  }

  buttonDown(key, control) {
    var context;
    if (control in POWERUPS) {
      context = this.powerupLegend[control];
      context.button.frame = CONTROLS[control].FRAMENUMBER + 1;
    } else {
    }

  }

  buttonUp(key, control) {
    var context;
    if (control in POWERUPS) {
      context = this.powerupLegend[control];
      context.button.frame = CONTROLS[control].FRAMENUMBER;
    } else {
    }
  }
}

module.exports = ApeHUD;

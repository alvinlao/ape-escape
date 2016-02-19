var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

var POWERUPS = config.APE.POWERUPS;
var CONTROLS = config.APE.CONTROLS;

var MARGINX = 100;   // distance from edge of screen (x)
var MARGINY = 20;   // distance from edge of screen (y)
var OFFSET = 2;     // distance from each element
var SCALE = 0.7;    // scale images


class ApeHUD extends Phaser.Group {
  // @param buttons (obj CONTROL => Phaser.Key)
  constructor(game, powerupInventory, buttons) {
    super(game);
    game.add.existing(this);

    this.buttons = buttons;

    this.createPowerupLegend(powerupInventory);
    this.createMovementLegend();
    this.bindButtons();
  }

  createPowerupLegend(powerupInventory) {
    var x = MARGINX;
    var y = config.CANVAS_HEIGHT - (config.TILE_SIZE * SCALE) - MARGINY;
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
    this.movementLegend = {};

    // Group everything together
    var movementGroup = new Phaser.Group(this.game, this);
    movementGroup.fixedToCamera = true;
    this.movementLegend.group = movementGroup;

    // Draw key
    function drawKey(x, y, frameNumber, button) {
      var buttonSprite = this.game.add.sprite(x, y, spritesheets.buttons.name, frameNumber);
      this.movementLegend[button] = {
        button: buttonSprite
      };
      movementGroup.add(buttonSprite);

      buttonSprite.scale.x = SCALE;
      buttonSprite.scale.y = SCALE;
    }

    // Draw positions
    var x = config.CANVAS_WIDTH - (config.TILE_SIZE * SCALE) - MARGINX;
    var y = config.CANVAS_HEIGHT - (config.TILE_SIZE * SCALE) - MARGINY;
    var delta = (config.TILE_SIZE * SCALE) + OFFSET;

    // Determines draw order (right to left)
    var keys = ['RIGHT', 'JUMP', 'LEFT'];
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      drawKey.call(this, x, y, CONTROLS[key].FRAMENUMBER, key);

      x -= delta;
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

  bindButtons() {
    for (var button in this.buttons) {
      var key = this.buttons[button];

      if(key.onDown) key.onDown.add(this.buttonDown, this, 0, button);
      if(key.onUp) key.onUp.add(this.buttonUp, this, 0, button);
    }
  }

  unbindButtons() {
    for (var button in this.buttons) {
      var key = this.buttons[button];

      if(key.onDown) key.onDown.remove(this.buttonDown, this);
      if(key.onUp) key.onUp.remove(this.buttonUp, this);
    }
  }

  buttonDown(key, control) {
    var context;
    if (control in POWERUPS) {
      context = this.powerupLegend[control];
    } else {
      context = this.movementLegend[control];
    }

    context.button.frame = CONTROLS[control].FRAMENUMBER + 1;
  }

  buttonUp(key, control) {
    var context;
    if (control in POWERUPS) {
      context = this.powerupLegend[control];
    } else {
      context = this.movementLegend[control];
    }

    context.button.frame = CONTROLS[control].FRAMENUMBER;
  }

  destroy() {
    // Remove key bindings
    this.unbindButtons();
    super.destroy();
  }
}

module.exports = ApeHUD;

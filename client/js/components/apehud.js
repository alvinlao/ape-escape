var spritesheets = require('../util/spritesheets.js');
var config = require('../util/config.js');

var BaseApeHUD = require('./baseapehud.js');

var POWERUPS = config.APE.POWERUPS;
var CONTROLS = config.APE.CONTROLS;

class ApeHUD extends BaseApeHUD {
  // @param buttons (obj CONTROL => Phaser.Key)
  constructor(game, powerupInventory, buttons) {
    super(game, powerupInventory);

    this.buttons = buttons;
    this.createPowerupLegend(powerupInventory, true);
    this.createMovementLegend();
    this.bindButtons();
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

      buttonSprite.scale.x = this.SCALE;
      buttonSprite.scale.y = this.SCALE;
    }

    // Draw positions
    var x = config.CANVAS_WIDTH - (config.TILE_SIZE * this.SCALE) - this.MARGINX;
    var y = config.CANVAS_HEIGHT - (config.TILE_SIZE * this.SCALE) - this.MARGINY;
    var delta = (config.TILE_SIZE * this.SCALE) + this.OFFSET;

    // Determines draw order (right to left)
    var keys = ['RIGHT', 'JUMP', 'LEFT'];
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      drawKey.call(this, x, y, CONTROLS[key].FRAMENUMBER, key);

      x -= delta;
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

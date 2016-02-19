var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');

var CONTROLS = config.GUARD.CONTROLS;

var MARGINX = 100;   // distance from edge of screen (x)
var MARGINY = 20;   // distance from edge of screen (y)
var OFFSET = 2;     // distance from each element
var SCALE = 0.7;    // scale images

class GuardHUD extends Phaser.Group {
  constructor(game, buttons) {
    super(game);
    game.add.existing(this);

    this.buttons = buttons;
    this.createMovementLegend();
    this.bindButton();
  }

  createMovementLegend() {
    this.movementLegend = {};

    // Group everything together
    var movementGroup = new Phaser.Group(this.game, this);
    movementGroup.fixedToCamera = true;
    this.movementLegend.group = movementGroup;

    // Draw key
    function drawKey(x, y, frameNumber, button) {
      var buttonSprite = this.game.add.sprite(x, y, spritesheets.guardbuttons.name, frameNumber);
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
    var keys = ['RIGHT', 'DOWN', 'UP', 'LEFT'];
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      drawKey.call(this, x, y, CONTROLS[key].FRAMENUMBER, key);

      x -= delta;
    }
  }

  bindButton() {
    for (var button in this.buttons) {
      var key = this.buttons[button];

      if (key.onDown) key.onDown.add(this.buttonDown, this, 0, button);
      if (key.onUp) key.onUp.add(this.buttonUp, this, 0, button);
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
    context = this.movementLegend[control];
    context.button.frame = CONTROLS[control].FRAMENUMBER + 1;
  }

  buttonUp(key, control) {
    var context;
    context = this.movementLegend[control];
    context.button.frame = CONTROLS[control].FRAMENUMBER;
  }

  destroy() {
    this.unbindButtons();
    super.destroy();
  }
}

module.exports = GuardHUD;

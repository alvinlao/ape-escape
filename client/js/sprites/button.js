class Button extends Phaser.Sprite {
  // @param keyCodes ( [Phaser.KeyCode] | Phaser.KeyCode )
  constructor(game, x, y, spriteSheetName, keyCodes, callback, callbackContext) {
    super(game, x, y, spriteSheetName);
    game.add.existing(this);

    if (!(keyCodes instanceof Array)) {
      this.keyCodes = [keyCodes];
    } else {
      this.keyCodes = keyCodes;
    }

    this.callback = callback;
    this.callbackContext = callbackContext;

    // Listen for input
    this.buttons = [];
    this.enableKeyboard();

    // Mouse press
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.events.onInputDown.add(this.down, this);
    this.events.onInputUp.add(this.up, this);
    this.events.onInputOver.add(this.over, this);
    this.events.onInputOut.add(this.out, this);
  }

  down() {
    this.frame = 2;
  }

  up() {
    this.frame = 0;

    this.game.time.events.add(Phaser.Timer.HALF, function() {
      this.callback.call(this.callbackContext);
    }, this);
  }

  over() {
    this.frame = 1;
  }

  out() {
    this.frame = 0;
  }

  destroy() {
    this.disableKeyboard();
    super.destroy();
  }

  enableKeyboard() {
    this.keyCodes.forEach(function(keyCode) {
      this.game.input.keyboard.addKeyCapture(keyCode);

      var button = this.game.input.keyboard.addKey(keyCode);
      button.onDown.add(this.down, this, 0);
      button.onUp.add(this.up, this, 0);

      this.buttons.push(button);
    }, this);
  }

  // @param keyCode ([Phaser.KeyCode] | Phaser.KeyCode) = key(s) to disable
  disableKeyboard(keyCodes) {
    var toDisable;
    if (typeof keyCodes !== 'undefined') {
      if (keyCodes instanceof Array) {
        toDisable = keyCodes;
      } else {
        toDisable = [keyCodes];
      }
    } else {
      toDisable = this.keyCodes;
    }

    toDisable.forEach(function(keyCode, i) {
      var button = this.buttons[i];

      button.onDown.remove(this.down, this);
      button.onUp.remove(this.up, this);
      this.game.input.keyboard.removeKeyCapture(keyCode);
    }, this);
  }
}

module.exports = Button;

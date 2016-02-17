var Button = require('./button.js');

class TextButton extends Button {
  constructor(game, x, y, spriteSheetName, text, textStyle, keyCodes, callback, callbackContext) {
    super(game, x, y, spriteSheetName, keyCodes, callback, callbackContext);

    this.textYOffset = -2;
    var pressDistance = 3;

    this.text = game.add.text(
        0.5,
        this.textYOffset,
        text,
        textStyle);
    this.text.anchor.set(0.5);
    this.addChild(this.text);

    this.restPosition = this.text.y;
    this.pressPosition = this.text.y + pressDistance;

    this.anchor.setTo(0.5);
  }

  down() {
    super.down();
    this.text.y = this.pressPosition;
  }

  up() {
    super.up();
    this.text.y = this.restPosition;
  }

  out() {
    super.out();
    this.text.y = this.restPosition;
  }
}

module.exports = TextButton;

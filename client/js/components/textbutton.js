var Button = require('./button.js');

class TextButton extends Button {
  constructor(game, x, y, spriteSheetName, text, textStyle, keyCodes, callback, callbackContext, blink) {
    super(game, x, y, spriteSheetName, keyCodes, callback, callbackContext);

    if (typeof blink === 'undefined') {
      blink = false;
    }

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

    this.doBlink = blink;
    if (blink) {
      this.timer = game.time.create(false);
      this.timer.loop(600, this.blink, this);
      this.timer.start();
    }
  }

  destroy() {
    if (this.timer) {
      this.timer = null;
    }
    super.destroy();
  }

  down() {
    super.down();
    if (this.doBlink) this.timer.pause();
    this.text.y = this.pressPosition;
  }

  up() {
    super.up();
    this.text.y = this.restPosition;
  }

  over() {
    super.over();
    if (this.doBlink) this.timer.pause();
    this.text.y = this.restPosition;
  }

  out() {
    super.out();
    if (this.doBlink) this.timer.resume();
    this.text.y = this.restPosition;
  }

  blink() {
    if (this.frame === 0) {
      this.frame = 2;
      this.text.y = this.pressPosition;
    } else if (this.frame === 2) {
      this.frame = 0;
      this.text.y = this.restPosition;
    }
  }
}

module.exports = TextButton;

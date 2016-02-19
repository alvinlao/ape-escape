var config = require('../util/config.js');

var GuardHUD = require('./guardhud.js');

class Guard {
  constructor(game) {
    this.game = game;

    // Movement
    this.leftDownTime = -1;
    this.rightDownTime = -1;
    this.upDownTime = -1;
    this.downDownTime = -1;

    // Controls
    this.leftKey = game.input.keyboard.addKey(config.GUARD.CONTROLS.LEFT.BUTTON);
    this.rightKey = game.input.keyboard.addKey(config.GUARD.CONTROLS.RIGHT.BUTTON);
    this.upKey = game.input.keyboard.addKey(config.GUARD.CONTROLS.UP.BUTTON);
    this.downKey = game.input.keyboard.addKey(config.GUARD.CONTROLS.DOWN.BUTTON);

    this.speed = config.GUARD.CAMERA_MOVE_SPEED;

    this.buttons = {
      'LEFT': this.leftKey,
      'RIGHT': this.rightKey,
      'UP': this.upKey,
      'DOWN': this.downKey
    }

    this.hud = new GuardHUD(this.game, this.buttons);
  }

  update() {
    if (!this.leftKey.isDown) {
      this.leftDownTime = -1;
    }

    if (!this.rightKey.isDown) {
      this.rightDownTime = -1;
    }

    if (!this.upKey.isDown) {
      this.upDownTime = -1;
    }

    if (!this.downKey.isDown) {
      this.downDownTime = -1;
    }

    if (this.leftKey.isDown && this.leftDownTime === -1) {
      this.leftDownTime = this.rightDownTime + 1;
    }

    if (this.rightKey.isDown && this.rightDownTime === -1) {
      this.rightDownTime = this.leftDownTime + 1;
    }

    if (this.upKey.isDown && this.upDownTime === -1) {
      this.upDownTime = this.downDownTime + 1;
    }

    if (this.downKey.isDown && this.downDownTime === -1) {
      this.downDownTime = this.upDownTime + 1;
    }

    if (this.leftDownTime != -1 || this.rightDownTime != -1) {
      if (this.leftDownTime > this.rightDownTime) {
        this.game.camera.x -= this.speed;
      } else {
        this.game.camera.x += this.speed;
      }
    }

    if (this.upDownTime != -1 || this.downDownTime != -1) {
      if (this.upDownTime > this.downDownTime) {
        this.game.camera.y -= this.speed;
      } else {
        this.game.camera.y += this.speed;
      }
    }
  }
}

module.exports = Guard;

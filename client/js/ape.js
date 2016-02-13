var SPEED = 350;
var JUMP_SPEED = 850;

class Ape extends Phaser.Sprite {
  constructor(game, x, y, name) {
    super(game, x, y, 'ape');

    this.anchor.setTo(0.5, 0.5);
    this.animations.add('walk', [0, 1], 10, true);
    this.animations.add('jump', [4, 5], 10, true);

    // Movement
    this.leftDownTime = -1;
    this.rightDownTime = -1;

    game.add.existing(this);

    // Physics
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = true;

    // Name tag
    var style = { font: "18px Arial", fill: "#000", align: "center" }
    this.nametag = game.add.text(0, 0, name, style);
    this.nametag.anchor.set(0.5);
  }

  moveLeft() {
    this.body.velocity.x = -SPEED;
    this.scale.x = -1;
    this.animations.play('walk');
  }

  moveRight() {
    this.body.velocity.x = SPEED;
    this.scale.x = 1;
    this.animations.play('walk');
  }

  stop() {
    this.body.velocity.x = 0;

    if (this.body.onFloor()) {
      this.frame = 3;
      this.animations.stop();
    } else {
      this.animations.play('jump');
    }
  }

  jump() {
    this.animations.play('jump');
    if (this.body.onFloor()) {
      this.body.velocity.y = -JUMP_SPEED;
    }
  }

  update(cursors) {
    this.nametag.x = this.x;
    this.nametag.y = Math.floor(this.y - 20 - this.height / 2);

    if (!cursors) return;

    if (!cursors.left.isDown) {
      this.leftDownTime = -1;
    }

    if (!cursors.right.isDown) {
      this.rightDownTime = -1;
    }

    if (cursors.left.isDown && this.leftDownTime === -1) {
      this.leftDownTime = this.rightDownTime + 1;
    }

    if (cursors.right.isDown && this.rightDownTime === -1) {
      this.rightDownTime = this.leftDownTime + 1;
    }

    if (this.leftDownTime != -1 || this.rightDownTime != -1) {
      if (this.leftDownTime > this.rightDownTime) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
    } else {
      this.stop();
    }

    if (cursors.up.isDown) {
      this.jump();
    }
  }
}

module.exports = Ape;

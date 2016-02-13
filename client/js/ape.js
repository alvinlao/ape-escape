var SPEED = 350;
var JUMP_SPEED = 850;

class Ape extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'ape');

    this.anchor.setTo(0.5, 0.5);
    this.animations.add('walk', [0, 1], 10, true);
    this.animations.add('jump', [4, 5], 10, true);
    this.speed = SPEED;

    game.add.existing(this);

    // Physics
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = true;
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
    } else {
    }
  }
}

module.exports = Ape;

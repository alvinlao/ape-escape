var Trap = require('./trap.js');

class DropTrap extends Trap {
  constructor(game, x, y) {
    super(game, x, y);

    this.visible = true;
    this.frame = 15;

    this.body.checkCollision.up = true;
    this.body.checkCollision.down = true;
    this.body.checkCollision.left = true;
    this.body.checkCollision.right = true;
    this.body.immovable = true;

    game.getDropTraps().add(this);
  }

  activate() {
    super.activate();

    this.body.checkCollision.up = false;
    this.body.allowGravity = true;

    // Remove drop trap from the game
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(function() {
      this.game.getDropTraps().remove(this);
    }, this);
  }
}

module.exports = DropTrap;


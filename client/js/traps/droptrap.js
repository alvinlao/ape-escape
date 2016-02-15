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

    // Create sprite
    
    // Enable gravity
  }
}

module.exports = DropTrap;


class ApeManager {
  constructor() {

    // Sent whenever a powerup is activated
    this.onPowerup = new Phaser.Signal();

    // Sent whenever the ape updates
    this.onUpdate = new Phaser.Signal();

    // Sent whenever the ape dies
    this.onDeath = new Phaser.Signal();
  }
}

module.exports = ApeManager;

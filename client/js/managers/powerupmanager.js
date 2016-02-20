class PowerupManager {
  constructor(map) {
    this.map = map;
    this.nextid = 0;
    this.powerups = {};

    // Send whenever a powerup is grabbed
    this.onGrab = new Phaser.Signal();
  }

  // @param powerups ([ Phaser.Tile ])
  add(powerups) {
    for (var i = 0; i < powerups.length; ++i) {
      var powerup = powerups[i];
      powerup.id = this.nextid;

      this.powerups[this.nextid] = powerup;
      this.nextid++;
    }
  }

  removeAll() {
    this.powerups = {};
  }
}

module.exports = PowerupManager;

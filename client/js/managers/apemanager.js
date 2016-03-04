class ApeManager {
  constructor() {
    this.nextPowerupId = 0;
    this.powerups = {};

    // Sent whenever a powerup is activated
    // @param powerup ( 'SHIELD' | 'BLINK' )
    // @param powerupArgs (obj)
    this.onPowerup = new Phaser.Signal();

    // Sent whenever the ape updates
    // TODO
    // @param keys
    this.onUpdate = new Phaser.Signal();

    // Sent whenever the ape dies
    // @param cause of death (string)
    this.onDeath = new Phaser.Signal();

    // Sent whenever the ape grabs a powerup
    // @param powerupid
    // @param quantity
    this.onGrabPowerup = new Phaser.Signal();

    // Sent whenever the ape teleports to the next level
    // @param levelIndex (int) = index of level as found in config.LEVELS
    this.onTeleport = new Phaser.Signal();

    //Sent whenever the Ape wins
    this.onWin = new Phaser.Signal();
  }

  addPowerups(powerups) {
    for (var i = 0; i < powerups.length; ++i) {
      var powerup = powerups[i];
      powerup.id = this.nextPowerupId;
      powerup.type = powerup.properties.powerup;

      this.powerups[this.nextPowerupId] = powerup;
      this.nextPowerupId++;
    }
  }

  removeAllPowerups() {
    this.powerups = {};
  }
}

module.exports = ApeManager;

class ApeClient {
  constructor(game) {
    this.game = game;
    this.socket = game.socket;

    // APE

    // TODO Alternative to mirror movement
    this.game.ape.onUpdate.add(function (keys) {
      this.socket.emit("move", keys);
    }, this);

    // TODO Send powerup information
    this.game.ape.onPowerup.add(function (powerup) {
      this.socket.emit("powerup", powerup);
    }, this);

    this.game.ape.onDeath.add(function (causeOfDeath) {
      this.socket.emit("death", causeOfDeath);
    }, this);

    // TRAPS

    // MAP
  }
}

module.exports = ApeClient;

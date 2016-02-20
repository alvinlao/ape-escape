class ApeClient {
  constructor(game) {
    this.game = game;
    this.socket = game.socket;

    // APE

    // TODO Alternative to mirror movement
    this.game.ape.onUpdate.add(function (keys) {
      this.socket.emit("move", keys);
    }, this);

    this.game.ape.onDeath.add(function (causeOfDeath) {
      this.socket.emit("death", causeOfDeath);
    }, this);

    this.game.ape.onGrabPowerup.add(function (powerupid) {
      this.socket.emit("grabpowerup", powerupid);
    }, this);

    // TODO Send powerup information
    this.game.ape.onPowerup.add(function (powerup) {
      this.socket.emit("powerup", powerup);
    }, this);

    // TRAPS

    this.socket.on(
        "trap_activate",
        this.game.traps.onActivate.dispatch.bind(this)
        );

    // MAP

  }
}

module.exports = ApeClient;

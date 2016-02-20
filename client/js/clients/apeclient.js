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

    this.game.ape.onPowerup.add(function (powerup, powerupArgs) {
      this.socket.emit("powerup", { type: powerup, args: powerupArgs });
    }, this);

    this.game.ape.onTeleport.add(function (levelIndex) {
      this.socket.emit("teleport", levelIndex);
    }, this);

    // TRAPS

    this.socket.on(
        "trap_activate",
        function (trapid) {
          game.traps.onActivate.dispatch(trapid);
        });

  }
}

module.exports = ApeClient;

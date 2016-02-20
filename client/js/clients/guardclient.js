class GuardClient {
  constructor(game) {
    this.game = game;
    this.socket = game.socket;

    // APE

    this.socket.on(
        "move",
        function (keys) {
          game.ape.onUpdate.dispatch(keys);
        }
        );

    this.socket.on(
        "death",
        function (causeOfDeath) {
          game.ape.onDeath.dispatch(causeOfDeath);
        }
        );

    this.socket.on(
        "grabpowerup",
        function (powerupid) {
          game.ape.onGrabPowerup.dispatch(powerupid);
        }
        );

    this.socket.on(
        "powerup",
        function (powerup) {
          game.ape.onPowerup.dispatch(powerup.type, powerup.args);
        }
        );

    // TRAPS

    /*
    this.socket.on(
        "trap_activate",
        this.game.traps.onActivate.dispatch.bind(this)
        );
        */

    */
    // MAP

  }
}

module.exports = GuardClient;

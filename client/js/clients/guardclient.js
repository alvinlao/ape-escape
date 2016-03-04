class GuardClient {
  constructor(game) {
    this.game = game;
    this.socket = game.socket;

    // APE

    this.socket.on(
        "move",
        function (keys) {
          game.ape.onUpdate.dispatch(keys);
        });

    this.socket.on(
        "death",
        function (causeOfDeath) {
          game.ape.onDeath.dispatch(causeOfDeath);
        });

    this.socket.on(
      "win",
      function () {
        game.ape.onWin.dispatch();
      });

    this.socket.on(
        "grabpowerup",
        function (powerup) {
          game.ape.onGrabPowerup.dispatch(powerup.powerupid, powerup.quantity);
        });

    this.socket.on(
        "powerup",
        function (powerup) {
          game.ape.onPowerup.dispatch(powerup.type, powerup.args);
        });

    this.socket.on(
        "teleport",
        function (levelIndex) {
          game.ape.onTeleport.dispatch(levelIndex);
        });

    // TRAPS
    // TODO Sync trap clicks (onUpdate)
    // TODO Sync trap initial counts

    this.game.traps.onClick.add(function (trapid) {
      this.socket.emit("trap_click", trapid);
    }, this);

    this.socket.on(
        "traps_update",
        function (traps) {
          game.traps.onUpdate.dispatch(traps);
        });

    this.socket.on(
        "trap_activate",
        function (trapid) {
          game.traps.onActivate.dispatch(trapid);
        });

    // CURSORS
    this.socket.on(
      "guard:move",
      function(info){
        game.cursors.onMove.dispatch(info.id,info.x,info.y);
      });
  }
}

module.exports = GuardClient;

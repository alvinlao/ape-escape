var config = require('../util/config.js');

var LevelState = require('./level.js');

class ApeLevelState extends LevelState {
  init(numGuards) {
    super.init(numGuards);

    this.activeTraps = null;
  }

  shutdown() {
    super.shutdown();

    this.activeTraps.forEach(function(trap) { trap.destroy() });
  }

  create() {
    super.create();

    // Input
    var controls = config.APE.CONTROLS;
    var keys = [];
    for (var control in controls) {
      var action = controls[control];
      keys.push(action.BUTTON);
    }
    this.game.input.keyboard.addKeyCapture(keys);

    // Active Traps
    this.activeTraps = [];
  }

  update() {
    super.update();

    // Active Traps
    this.game.physics.arcade.overlap(
        this.ape,
        this.activeTraps,
        function(ape, trap) {
          trap.killedPlayer = this.ape.die(trap.getDeathMessage());
        },
        function(ape, trap) {
          // Give the ape a margin of error
          return !(ape.bottom - trap.top >= 0 &&
              ape.bottom - trap.top <= 1);
        },
        this
      );

    // SPIKES!
    this.game.physics.arcade.collide(this.ape, this.map.createdLayers['spikes'], function(){
      this.ape.die(config.APE.DEATH.SPIKES);
    }, null, this);

  }
}

module.exports = ApeLevelState;


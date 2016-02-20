var config = require('../util/config.js');

var Ape = require('../entities/ape.js');
var LevelState = require('./level.js');

var ApeClient = require('../clients/apeclient.js');

class ApeLevelState extends LevelState {
  init(gameState) {
    super.init(gameState);

    this.loadingLevel = false;
    this.loadedLevel = false;
    this.game.activeTraps = null;

    this.client = new ApeClient(this.game);
  }

  shutdown() {
    super.shutdown();

    this.game.activeTraps.forEach(function(trap) { trap.destroy() });
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
    this.game.activeTraps = [];

    // Create our friendly neighbourhood ape
    this.ape = new Ape(this.game, config.APE.SPAWN_X, config.APE.SPAWN_Y, this.game.playerName);
    this.game.camera.follow(this.ape);
  }

  update() {
    super.update();

    //Load next level!
    this.game.physics.arcade.overlap(this.ape, this.map.createdLayers['teleporters'], function(sprite, tile){
      if(tile.index===-1 || this.loadingLevel) return;
      this.game.ape.onTeleport.dispatch(this.currentLevelId + 1);

      // Change teleporter color
      tile.teleporter.go();

      this.loadingLevel = true;
      this.game.time.events.add((Phaser.Timer.SECOND * config.APE.TELEPORT_DELAY), function() {
        this.loadNextLevel();
      }, this);
    }, null, this);

    // NOTE: This MUST be after teleport code
    if (this.loadedLevel) {
      this.loadedLevel = false;
      this.loadingLevel = false;
    }

    // Powerups
    this.game.physics.arcade.overlap(this.ape, this.map.createdLayers['powerups'], function(sprite, tile){
      //TODO why does it call this all the time?
      if(tile.index===-1) return;
      var quantity = parseInt(tile.properties.quantity);

      this.ape.grabPowerup(tile.properties.powerup, parseInt(tile.properties.quantity));
      this.game.ape.onGrabPowerup.dispatch(tile.id, quantity);
    }, null, this);

    // Active Traps
    this.game.physics.arcade.overlap(
        this.ape,
        this.game.activeTraps,
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

    // Pointy spikes
    this.game.physics.arcade.collide(this.ape, this.map.createdLayers['spikes'], function(){
      this.ape.die(config.APE.DEATH.SPIKES);
    }, null, this);

    // Watery water
    this.game.physics.arcade.collide(this.ape, this.map.createdLayers['water'], function(){
      this.ape.die(config.APE.DEATH.WATER);
    }, null, this);

    this.ape.update();
  }

  loadLevel(levelName, levelIndex) {
    super.loadLevel(levelName, levelIndex);
    this.loadedLevel = true;
  }
}

module.exports = ApeLevelState;


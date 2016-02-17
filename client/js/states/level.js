var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');

var Ape = require('../entities/ape.js');
var Map = require('../map.js');

var GameOver = require('../sprites/gameover.js');

class LevelState extends Phaser.State {
  init() {
    this.ape = null;
    this.map = null;

    this.activeTraps = null;
    this.dropTraps = null;

    this.loadingLevel = false;
    this.currentLevelId = -1;
    this.gameover = null;
  }

  shutdown() {
    this.ape.destroy();

    // Clean up map
    if(this.map){
      //Destroy the previous level
      for(var level in this.map.createdLayers){
        this.map.createdLayers[level].destroy();
      }
      this.map.destroy();

      // Clean up all the objects
      this.game.world.children.forEach(function(child) {
          child.destroy();
      });
      this.game.world.removeAll();
    }

    this.activeTraps.forEach(function(trap) { trap.destroy() });
    this.dropTraps.forEach(function(trap) { trap.destroy() });
    this.gameover.destroy();
  }

  create() {
    super.create();

    var game = this.game;

    // Input
    var controls = config.APE.CONTROLS;
    var keys = [];
    for (var control in controls) {
      var action = controls[control];
      keys.push(action.BUTTON);
    }
    game.input.keyboard.addKeyCapture(keys);

    // Active Traps
    this.activeTraps = [];

    // Drop traps
    this.dropTraps = [];

    // Needed for raycasting so that objects can query
    game.getMap = (function() {
      return this.map;
    }).bind(this);

    // Needed for adding and removing traps
    game.getActiveTraps = (function() {
      return this.activeTraps;
    }).bind(this);

    game.getDropTraps = (function() {
      return this.dropTraps;
    }).bind(this);

    // Swap maps
    game.loadLevel = (function(levelName) {
      if(this.map){
        //Destroy the previous level
        for(var level in this.map.createdLayers){
          this.map.createdLayers[level].destroy();
        }
        this.map.destroy();

        // Clean up all the objects
        game.world.children.forEach(function(child) {
          if (child !== this.ape) {
            child.destroy();
          }
        }, this);
        game.world.removeAll();
      }

      this.map = new Map(game, levelName,
          [
            spritesheets.tiles.name,
            spritesheets.misc.name,
            spritesheets.traps.name
          ], 2);

      if(this.ape){
        this.ape.x = 100;
        this.ape.y = 50;

        game.world.add(this.ape);
        this.ape.refresh();
      }
      this.loadingLevel = false;
    }).bind(this);

    game.loadNextLevel = (function(){
      game.loadLevel(game.levelOrder[++this.currentLevelId]);
    }).bind(this);

    //Load the first level
    game.loadNextLevel();

    // Entities
    this.ape = new Ape(game, 100, 50, game.playerName);

    game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    game.camera.follow(this.ape);
  }

  update() {
    super.update();

    var game = this.game;

    // Water
    game.physics.arcade.collide(this.ape, this.map.createdLayers['water'], function(){
      this.ape.die(config.APE.DEATH.WATER);
    }, null, this);

    // Powerups
    game.physics.arcade.overlap(this.ape, this.map.createdLayers['powerups'], function(sprite, tile){
      //TODO why does it call this all the time?
      if(tile.index===-1) return;

      this.ape.grabPowerup(tile.properties.powerup, parseInt(tile.properties.quantity));
      this.map.removeTile(tile.x,tile.y, this.map.createdLayers['powerups']);
    }, null, this);

    //Load next level!
    game.physics.arcade.overlap(this.ape, this.map.createdLayers['teleporters'], function(sprite, tile){
      if(tile.index===-1 || this.loadingLevel) return;

      // Change teleporter color
      tile.teleporter.go();

      this.loadingLevel = true;
      game.time.events.add((Phaser.Timer.SECOND * 1), function() {
        //TODO make the jailers teleport instantly so they can set up traps, then the ape comes in?
        game.loadNextLevel();
      });
    }, null, this);

    // Active Traps
    game.physics.arcade.overlap(
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

    // Blocks
    game.physics.arcade.collide(this.ape, this.map.createdLayers['main']);

    game.physics.arcade.collide(this.dropTraps, [this.map.createdLayers['main'], this.map.createdLayers['spikes']], function(trap, tile) {
      trap.deactivate();
    });

    game.physics.arcade.collide(this.ape, this.dropTraps, null, function(ape, trap) {
      return !trap.killedPlayer && !trap.active;
    });

    // SPIKES!
    game.physics.arcade.collide(this.ape, this.map.createdLayers['spikes'], function(){
      this.ape.die(config.APE.DEATH.SPIKES);
    }, null, this);

    this.ape.update();

    // Game over screen
    if (this.ape.isDead && this.gameover === null) {
      var currentLevel = this.currentLevelId;
      var totalLevels = game.levelOrder.length;
      this.gameover = new GameOver(game, currentLevel, totalLevels, this.ape.causeOfDeath);
    }
  }
}

module.exports = LevelState;

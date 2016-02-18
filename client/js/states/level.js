var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');
var ROLE = require('../util/role.js');

var Ape = require('../entities/ape.js');
var Map = require('../map.js');
var TrapManager = require('../traps/trapmanager.js');
var PowerupManager = require('../entities/powerupmanager.js');

var GameOver = require('../sprites/gameover.js');

class LevelState extends Phaser.State {
  init(numGuards) {
    this.game.numGuards = numGuards;
    this.game.traps = new TrapManager();
    this.game.powerups = new PowerupManager();

    this.ape = null;
    this.map = null;

    this.dropTraps = null;

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

    this.dropTraps.forEach(function(trap) { trap.destroy() });
    this.gameover.destroy();
  }

  create() {
    super.create();

    var game = this.game;

    // Drop traps
    this.dropTraps = [];

    // Needed for raycasting so that objects can query
    game.getMap = (function() {
      return this.map;
    }).bind(this);

    game.getDropTraps = (function() {
      return this.dropTraps;
    }).bind(this);

    //Load the first level
    this.loadNextLevel();

    // Entities
    game.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
  }

  update() {
    super.update();

    var game = this.game;

    // Ape to ground collision
    game.physics.arcade.collide(this.ape, this.map.createdLayers['main']);

    // Drop trap to ground and spikes collision
    game.physics.arcade.collide(this.dropTraps, [this.map.createdLayers['main'], this.map.createdLayers['spikes']], function(trap, tile) {
      trap.deactivate();
    });

    // Ape to drop traps collision
    game.physics.arcade.collide(this.ape, this.dropTraps, null, function(ape, trap) {
      return !trap.killedPlayer && !trap.active;
    });

    // Game over screen
    if (this.ape.isDead && this.gameover === null) {
      var currentLevel = this.currentLevelId;
      var totalLevels = game.levelOrder.length;
      this.gameover = new GameOver(game, currentLevel, totalLevels, this.ape.causeOfDeath);
    }
  }

  destroyLevel() {
    if (this.map) {
      //Destroy the previous level
      for(var level in this.map.createdLayers){
        this.map.createdLayers[level].destroy();
      }

      this.map.destroy();

      // Clean up all the objects
      this.game.world.children.forEach(function(child) {
        if (child !== this.ape) {
          child.destroy();
        }
      }, this);

      // Clear all sprites
      this.game.world.removeAll();

      // Clean up managers
      this.game.traps.removeAll();
      this.game.powerups.removeAll();
    }
  }

  loadLevel(levelName) {
    this.destroyLevel();

    this.map = new Map(this.game, levelName,
        [
          spritesheets.tiles.name,
          spritesheets.misc.name,
          spritesheets.traps.name
        ]);

    if(this.ape) {
      this.ape.x = config.APE.SPAWN_X;
      this.ape.y = config.APE.SPAWN_Y;

      this.game.world.add(this.ape);
      this.ape.refresh();
    }
  }

  loadNextLevel() {
    this.loadLevel(this.game.levelOrder[++this.currentLevelId]);
  }
}

module.exports = LevelState;

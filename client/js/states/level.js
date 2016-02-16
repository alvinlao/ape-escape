var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');

var Ape = require('../ape.js');
var Map = require('../map.js');

var ape;

var map, layer;
var activeTraps, dropTraps;

var loadingLevel = false;
var currentLevelId = -1; //No level

class LevelState extends Phaser.State {
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
    activeTraps = game.add.group();

    // Drop traps
    dropTraps = game.add.group();

    // Needed for raycasting so that objects can query
    game.getMap = function() {
      return map;
    }

    // Needed for adding and removing traps
    game.getActiveTraps = function() {
      return activeTraps;
    }

    game.getDropTraps = function() {
      return dropTraps;
    }

    // Swap maps
    game.loadLevel = function(levelName) {
      if(map){
        //Destroy the previous level
        for(var level in map.createdLayers){
          map.createdLayers[level].destroy();
        }
        map.destroy();

        // Clean up all the objects
        game.world.children.forEach(function(child) {
          if (child !== ape) {
            child.destroy();
          }
        });
        game.world.removeAll();
      }

      map = new Map(game, levelName,
          [
            spritesheets.tiles.name,
            spritesheets.misc.name,
            spritesheets.traps.name
          ], 2);

      if(ape){
        ape.x = 100;
        ape.y = 50;

        game.world.add(ape);
        ape.refresh();
      }
      loadingLevel = false;
    }

    game.loadNextLevel = function(){
      game.loadLevel(game.levelOrder[++currentLevelId]);
    }

    //Load the first level
    game.loadNextLevel();

    // Entities
    ape = new Ape(game, 100, 50, "Mr. Ape");

    game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    game.camera.follow(ape);
  }

  update() {
    super.update();

    var game = this.game;

    // SPIKES!
    game.physics.arcade.collide(ape, map.createdLayers['spikes'], function(){
      ape.die();
    });

    // Powerups
    game.physics.arcade.overlap(ape, map.createdLayers['powerups'], function(sprite, tile){
      //TODO why does it call this all the time?
      if(tile.index===-1) return;

      ape.grabPowerup(tile.properties.powerup, parseInt(tile.properties.quantity));
      map.removeTile(tile.x,tile.y, map.createdLayers['powerups']);
    },null,this);

    //Load next level!
    game.physics.arcade.overlap(ape, map.createdLayers['teleporters'], function(sprite, tile){
      if(tile.index===-1 || loadingLevel) return;

      // Change teleporter color
      tile.teleporter.go();

      loadingLevel = true;
      game.time.events.add((Phaser.Timer.SECOND * 1), function() {
        //TODO make the jailers teleport instantly so they can set up traps, then the ape comes in?
        game.loadNextLevel();
      });
    });

    // Blocks
    game.physics.arcade.collide(ape, [map.createdLayers['main'], dropTraps]);

    // Active Traps
    game.physics.arcade.overlap(ape, activeTraps, function(ape, trap) {
      ape.die();
    });

    ape.update();
  }
}

module.exports = LevelState;

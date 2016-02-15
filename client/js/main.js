var config = require('./config.js');
var spritesheets = require('./spritesheets.js');

var Ape = require('./ape.js');
var Map = require('./map.js');

var FireTrap = require('./traps/firetrap.js');

// Phaser game
var game = new Phaser.Game(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

var cursors;
var ape;

var map, layer;
var activeTraps, dropTraps;

var loadingLevel = false;
var currentLevelId = -1; //No level
var levelOrder = ["test","level2"];

function preload() {
  game.load.spritesheet(spritesheets.ape.name, spritesheets.ape.file, 50, 50);
  game.load.image(spritesheets.shield.name, spritesheets.shield.file);

  for (var i = 0; i < levelOrder.length; i++) {
    var levelName = levelOrder[i]
    game.load.tilemap(levelName, 'assets/maps/' + levelName + '.json', null, Phaser.Tilemap.TILED_JSON);
  }

  game.load.spritesheet(spritesheets.tiles.name, spritesheets.tiles.file, 64, 64);
  game.load.spritesheet(spritesheets.misc.name, spritesheets.misc.file, 64, 64);
  game.load.spritesheet(spritesheets.traps.name, spritesheets.traps.file, 64, 64);
}

function create() {
  game.stage.backgroundColor = "#FFFFFF";

  // Physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 2500;
  game.physics.arcade.TILE_BIAS = 40;
  game.time.deltaCap = 0.2;

  // Performance
  game.time.desiredFps = 60;

  // Input
  cursors = game.input.keyboard.createCursorKeys();
  game.input.keyboard.addKeyCapture([Phaser.Keyboard.Z]);

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
    }
    loadingLevel = false;
  }

  game.loadNextLevel = function(){
    game.loadLevel(levelOrder[++currentLevelId]);
  }

  //Load the first level
  game.loadNextLevel();

  // Entities
  ape = new Ape(game, 100, 50, "Mr. Ape");

  game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  game.camera.follow(ape);
}

function update() {
  // SPIKES!
  game.physics.arcade.collide(ape, map.createdLayers['spikes'], function(){
    ape.die();
  });

  // Powerups
  game.physics.arcade.overlap(ape, map.createdLayers['powerups'], function(sprite, tile){
    //TODO why does it call this all the time?
    if(tile.index===-1) return;
    ape.grabPowerup(tile.properties.powerup);
    map.removeTile(tile.x,tile.y, map.createdLayers['powerups']);
  },null,this);

  //Load next level!
  game.physics.arcade.overlap(ape, map.createdLayers['teleporters'], function(sprite, tile){
    if(tile.index===-1 || loadingLevel) return;
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

  ape.update(cursors);
}

var config = require('./config.js');
var spritesheets = require('./spritesheets.js');
var Ape = require('./ape.js');
var Map = require('./map.js');

// Phaser game
var game = new Phaser.Game(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors;
var ape;

var map, layer;

function preload() {
  game.load.spritesheet(spritesheets.ape.name, spritesheets.ape.file, 50, 50);
  game.load.image(spritesheets.shield.name, spritesheets.shield.file);

  game.load.tilemap('test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);

  game.load.image(spritesheets.tiles.name, spritesheets.tiles.file);
  game.load.image(spritesheets.misc.name, spritesheets.misc.file);
  game.load.image(spritesheets.traps.name, spritesheets.traps.file);
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

  // Map
  map = new Map(game, 'test',
      [
        spritesheets.tiles.name,
        spritesheets.misc.name,
        spritesheets.traps.name
      ], 2);

  // Entities
  ape = new Ape(game, 100, 0, "Mr. Ape");

  game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  game.camera.follow(ape);

  //Needed for raycasting so that objects can query
  game.getMap = function() {
    return map;
  }
}

function update() {
  game.physics.arcade.collide(ape, map.createdLayers['spikes'], function(){
    ape.die();
  });
  game.physics.arcade.overlap(ape, map.createdLayers['powerups'], function(sprite, tile){
    //TODO why does it call this all the time?
    if(tile.index===-1) return;
    ape.grabPowerup(tile.properties.powerup);
    map.removeTile(tile.x,tile.y, map.createdLayers['powerups']);
  },null,this);

  game.physics.arcade.collide(ape, map.createdLayers['main']);

  ape.update(cursors);
}

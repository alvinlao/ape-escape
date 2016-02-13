var config = require('./config.js');
var Ape = require('./ape.js');
var Map = require('./map.js');

// Phaser game
var game = new Phaser.Game(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors;
var ape;

var map, layer;

function preload() {
  game.load.spritesheet('ape', 'assets/ape_spritesheet.png', 50, 50);

  game.load.tilemap('test', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tilesheet', 'assets/tilesheet.png');
}

function create() {
  game.stage.backgroundColor = "#FFFFFF";

  // Physics
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 2500;
  game.time.deltaCap = 0.2;

  // Performance
  game.time.desiredFps = 60;

  // Input
  cursors = game.input.keyboard.createCursorKeys();

  // Entities
  ape = new Ape(game, 100, 0);

  // Map
  map = new Map(game, 'test', 'tilesheet');

  game.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  game.camera.follow(ape);
}

var leftDownTime, rightDownTime;
function update() {
  game.physics.arcade.collide(ape, map.createdLayers['main']);

  if (!cursors.left.isDown) {
    leftDownTime = -1;
  }

  if (!cursors.right.isDown) {
    rightDownTime = -1;
  }

  if (cursors.left.isDown && leftDownTime === -1) {
    leftDownTime = rightDownTime + 1;
  }

  if (cursors.right.isDown && rightDownTime === -1) {
    rightDownTime = leftDownTime + 1;
  }

  if (leftDownTime != -1 || rightDownTime != -1) {
    if (leftDownTime > rightDownTime) {
      ape.moveLeft();
    } else {
      ape.moveRight();
    }
  } else {
    ape.stop();
  }

  if (cursors.up.isDown) {
    ape.jump();
  }
}

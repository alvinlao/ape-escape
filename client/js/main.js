var config = require('./config.js');
var Ape = require('./ape.js');

// Phaser game
var game = new Phaser.Game(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors;
var ape;

function preload() {
  game.load.spritesheet('ape', 'assets/ape_spritesheet.png', 50, 50);
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 2500;

  game.time.desiredFps = 60;

  cursors = game.input.keyboard.createCursorKeys();
  game.stage.backgroundColor = "#FFFFFF";

  ape = new Ape(game, 100, config.CANVAS_HEIGHT + 50);
}

function update() {
  if (cursors.left.isDown && cursors.right.isDown) {
    ape.stop();
  } else {
    if (cursors.left.isDown) {
      ape.moveLeft();
    } else if (cursors.right.isDown) {
      ape.moveRight();
    } else {
      ape.stop();
    }
  }

  if (cursors.up.isDown) {
    ape.jump();
  }
}

var config = require('./util/config.js');
var spritesheets = require('./util/spritesheets.js');

var BootState = require('./states/boot.js');
var LoadState = require('./states/load.js');
var TitleState = require('./states/title.js');
var LobbyState = require('./states/lobby.js');
var LevelState = require('./states/level.js');

// Phaser game
//var game = new Phaser.Game(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var game = new Phaser.Game(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Phaser.CANVAS, '');

// Levels
game.levelOrder = ["test", "level2"];

game.state.add('boot', new BootState());
game.state.add('load', new LoadState());
game.state.add('title', new TitleState());
game.state.add('lobby', new LobbyState());
game.state.add('level', new LevelState());

game.state.start('boot');

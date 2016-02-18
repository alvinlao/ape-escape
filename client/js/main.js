var config = require('./util/config.js');
var spritesheets = require('./util/spritesheets.js');

var BootState = require('./states/boot.js');
var LoadState = require('./states/load.js');
var TitleState = require('./states/title.js');
var LobbyState = require('./states/lobby.js');
var ApeLevelState = require('./states/apelevel.js');
var GuardLevelState = require('./states/guardlevel.js');

// Phaser game
var gameConfig = {
  width: config.CANVAS_WIDTH,
  height: config.CANVAS_HEIGHT,
  renderer: Phaser.CANVAS,
  //resolution: window.devicePixelRatio
}

var game = new Phaser.Game(gameConfig);

// Levels
game.levelOrder = config.LEVELS;

game.state.add('boot', new BootState());
game.state.add('load', new LoadState());
game.state.add('title', new TitleState());
game.state.add('lobby', new LobbyState());
game.state.add('apelevel', new ApeLevelState());
game.state.add('guardlevel', new GuardLevelState());

game.state.start('boot');

//Set up io
game.socket = io(config.URL, config.SOCKET_SETTINGS);

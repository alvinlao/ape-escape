var spritesheets = require('../util/spritesheets.js');
var state = require('../util/state.js');

class LoadState extends Phaser.State {
  create() {
    super.create();

    var game = this.game;

    game.load.spritesheet(spritesheets.ape.name, spritesheets.ape.file, 50, 50);
    game.load.image(spritesheets.shield.name, spritesheets.shield.file);
    game.load.image(spritesheets.blink.name, spritesheets.blink.file);

    game.load.spritesheet(spritesheets.guardpointer.name, spritesheets.guardpointer.file, 64, 64);

    game.load.spritesheet(spritesheets.buttons.name, spritesheets.buttons.file, 64, 64);
    game.load.spritesheet(spritesheets.guardbuttons.name, spritesheets.guardbuttons.file, 64, 64);

    game.load.spritesheet(spritesheets.bluebutton2.name, spritesheets.bluebutton2.file, 128, 64);
    game.load.spritesheet(spritesheets.bluebutton4.name, spritesheets.bluebutton4.file, 256, 64);
    game.load.spritesheet(spritesheets.redbutton2.name, spritesheets.redbutton2.file, 128, 64);
    game.load.spritesheet(spritesheets.redbutton4.name, spritesheets.redbutton4.file, 256, 64);

    for (var i = 0; i < game.levelOrder.length; i++) {
      var levelName = game.levelOrder[i]
      game.load.tilemap(levelName, 'common/maps/' + levelName + '.json', null, Phaser.Tilemap.TILED_JSON);
    }

    game.load.spritesheet(spritesheets.tiles.name, spritesheets.tiles.file, 64, 64);
    game.load.spritesheet(spritesheets.misc.name, spritesheets.misc.file, 64, 64);
    game.load.spritesheet(spritesheets.traps.name, spritesheets.traps.file, 64, 64);

    // TODO: Loading bar
    game.load.onLoadComplete.add(loadComplete, this);
    game.load.start();
  }
}

function loadComplete() {
  var game = this.game;
  game.socket.on("state", function(currentState){
    game.socket.removeAllListeners("state");
    switch(currentState){
      case state.GAME:
        game.state.start('inprogress');
        //Wait for end game
        game.socket.on("end_game", function(){
          game.state.start('title');
        });
        break;
      case state.LOADING:
      case state.LOBBY:
      default:
        game.state.start('title');
        break;
    }
  });
  game.socket.emit("get_state");
}

module.exports = LoadState;

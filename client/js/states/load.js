var spritesheets = require('../util/spritesheets.js');

class LoadState extends Phaser.State {
  create() {
    super.create();

    var game = this.game;

    game.load.spritesheet(spritesheets.ape.name, spritesheets.ape.file, 50, 50);
    game.load.image(spritesheets.shield.name, spritesheets.shield.file);
    game.load.image(spritesheets.blink.name, spritesheets.blink.file);

    game.load.spritesheet(spritesheets.buttons.name, spritesheets.buttons.file, 64, 64);
    game.load.spritesheet(spritesheets.spacebar.name, spritesheets.spacebar.file, 256, 64);
    game.load.spritesheet(spritesheets.apeButton.name, spritesheets.apeButton.file, 128, 64);
    game.load.spritesheet(spritesheets.zookeeperButton.name, spritesheets.zookeeperButton.file, 256, 64);

    for (var i = 0; i < game.levelOrder.length; i++) {
      var levelName = game.levelOrder[i]
      game.load.tilemap(levelName, 'assets/maps/' + levelName + '.json', null, Phaser.Tilemap.TILED_JSON);
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
  this.game.state.start('title');
}

module.exports = LoadState;

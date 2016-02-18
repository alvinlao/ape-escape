var config = require('../util/config.js');

var Ape = require('../entities/ape.js');
var LevelState = require('./level.js');

class GuardLevelState extends LevelState {
  create() {
    super.create();

    // TODO Remote ape
    this.ape = new Ape(this.game, config.APE.SPAWN_X, config.SPAWN_Y, this.game.playerName);

    // TODO Guard camera control
  }
}

module.exports = GuardLevelState;

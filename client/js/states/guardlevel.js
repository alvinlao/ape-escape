var config = require('../util/config.js');

var Ape = require('../entities/ape.js');
var LevelState = require('./level.js');

class GuardLevelState extends LevelState {
  create() {
    super.create();

    // TODO Remote ape
    this.ape = new Ape(this.game, config.APE.SPAWN_X, config.SPAWN_Y, this.game.playerName);

    // TODO Guard camera control

    // TODO Listen to server events
    //
    // Grab powerup
    // this.game.powerups.onGrab.dispatch( powerupid )
    //
    // Ape death
    // this.ape.die()
    //
    // Next level
    // this.loadNextLevel()
    //
    // Server sending trap clicksLeft update
    // this.game.traps.onTrapUpdate.add( listener )


    // TODO Send trap events
    // TrapManager
    //
    // Guard clicked on a trap:
    // this.game.traps.onTrapClick.add( listener )
    //
    // Traps created for new level
    // this.game.traps.onTrapActivatorsCreate.add( listener )
  }
}

module.exports = GuardLevelState;

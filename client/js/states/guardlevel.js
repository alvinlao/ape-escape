var config = require('../util/config.js');

var RemoteApe = require('../entities/remoteape.js');
var Guard = require('../entities/guard.js');
var LevelState = require('./level.js');

class GuardLevelState extends LevelState {
  create() {
    super.create();

    // TODO Remote ape
    this.ape = new RemoteApe(this.game, config.APE.SPAWN_X, config.SPAWN_Y, this.game.playerName);

    this.guard = new Guard(this.game);

    // TODO Guard camera control

    // TODO Listen to server events
    //
    // Grab powerup
    // this.game.powerups.onGrab.dispatch( powerupid )
    //
    // Ape death
    // this.ape.die()
    //
    // Ape uses powerup
    // this.ape.powerup( 
    //    POWERUP enum { 'BLINK' | 'SHIELD },
    //    arg1, arg2, ... , argN
    //  )
    //
    // Next level
    // this.loadNextLevel()
    //
    // Server sending trap clicksLeft update
    // this.game.traps.onUpdate.add( listener )


    // TODO Send trap events
    // TrapManager
    //
    // Guard clicked on a trap:
    // this.game.traps.onClick.add( listener )
    //
    // Traps created for new level
    // this.game.traps.onCreateActivators.add( listener )
  }

  update() {
    super.update();
    this.guard.update();
  }
}

module.exports = GuardLevelState;

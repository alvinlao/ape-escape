var config = require('../util/config.js');

var RemoteApe = require('../entities/remoteape.js');
var Guard = require('../entities/guard.js');
var LevelState = require('./level.js');
var RemoteGuard = require('../entities/remoteguard.js');

var GuardGameOver = require('../components/guardgameover.js');
var GuardClient = require('../clients/guardclient.js');

class GuardLevelState extends LevelState {
  create() {
    super.create();

    // TODO Remote ape
    this.ape = new RemoteApe(this.game, config.APE.SPAWN_X, config.SPAWN_Y, this.game.gameState.apeName);

    this.client = new GuardClient(this.game);

    this.game.ape.onTeleport.add(function (levelIndex) {
      this.loadLevel(this.game.levelOrder[levelIndex], levelIndex);
    }, this);

    //Add the cursors (tell the cursor manager)
    for(var i=0;i<this.game.gameState.guards.length;i++){
      var thisGuard = this.game.gameState.guards[i];
      var newSprite = new RemoteGuard(this.game, -50, -50);
      this.game.cursors.newGuardCursor.dispatch(thisGuard.id, newSprite);
    }

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

  createGameOverScreen(currentLevel, totalLevels, causeOfDeath) {
    return new GuardGameOver(this.game, currentLevel, totalLevels, causeOfDeath);
  }

  loadLevel(levelName, levelIndex) {
    super.loadLevel(levelName, levelIndex);
    this.guard = new Guard(this.game);
  }

  update() {
    super.update();
    this.guard.update();
  }
}

module.exports = GuardLevelState;

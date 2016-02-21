var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');
var buttonconfig = require('../util/buttonconfig.js');

var GameOver = require('./gameover.js');

class GuardGameOver extends GameOver {
  constructor(game, currentLevel, totalLevels, causeOfDeath) {
    super(game, currentLevel, totalLevels, causeOfDeath);
  }

  getDeathMessage(causeOfDeath) {
    return config.GUARD.DEATH[causeOfDeath];
  }

  getSpaceButtonConfig() {
    return  {
      spritesheetName: spritesheets.redbutton4.name,
      style: buttonconfig.RED_STYLE
    }
  }
}

module.exports = GuardGameOver;

var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');
var buttonconfig = require('../util/buttonconfig.js');

var GameOver = require('./gameover.js');

class ApeGameOver extends GameOver {
  constructor(game, currentLevel, totalLevels, causeOfDeath) {
    super(game, currentLevel, totalLevels, causeOfDeath);
  }

  getDeathMessage(causeOfDeath) {
    return config.APE.DEATH[causeOfDeath];
  }

  getSpaceButtonConfig() {
    return  {
      spritesheetName: spritesheets.bluebutton4.name,
      style: buttonconfig.BLUE_STYLE
    }
  }
}

module.exports = ApeGameOver;

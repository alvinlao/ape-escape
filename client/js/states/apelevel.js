var config = require('../util/config.js');

var LevelState = require('./level.js');

class ApeLevelState extends LevelState {
  create() {
    super.create();

    // Input
    var controls = config.APE.CONTROLS;
    var keys = [];
    for (var control in controls) {
      var action = controls[control];
      keys.push(action.BUTTON);
    }
    this.game.input.keyboard.addKeyCapture(keys);
  }
}

module.exports = ApeLevelState;


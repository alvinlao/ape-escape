var config = require('../util/config.js');
class InProgressState extends Phaser.State {
	create() {
		super.create();
		var game = this.game;

		var messageX = Math.floor(config.CANVAS_WIDTH / 2); 
		var messageY = Math.floor(config.CANVAS_HEIGHT / 2); 
		var style = { font: "32px Arial", fill: "#253659", align: "center" };
		var busyMessage = game.add.text(messageX, messageY, "Game in progress. This page will auto refresh once the game has finished",style);
	}
}

module.exports = InProgressState;
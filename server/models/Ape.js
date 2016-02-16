var ROLE = require("./ROLE");

var Ape = function(){
	this.role = ROLE.APE;
	this.x = 0;
	this.y = 0;
	this.powerupActive = false;
	this.currentPowerup = 0;
}

module.exports = Ape;
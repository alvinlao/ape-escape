var state = require("./state");
var GAME_STATE = require("./models/GAME_STATE")

var io;
exports.attachIO = function(newio){
	io = newio;
}

var startGame = function(){
	state.currentState = GAME_STATE.GAME;

	var ape = Math.floor(Math.random()*(state.sockets.length-1));

	//TODO there might be a better way to attach all this jazz
	for(var i=0;i<state.sockets;i++){
		if(i==ape){
			attachApe(state.sockets[i]);
		} else {
			attachJailer(state.sockets[i]);
		}
	}
}

var attachApe = function(socket){
	socket.on("move", function(){
		socket.broadcast.emit("ape:move", {
			x: socket.game.x,
			y: socket.game.y
		});
	});
	//powerup
	//death
	//teleporter
}

var attachJailer = function(socket){
	socket.on("move", function(){
		socket.broadcast.emit("jailer:move", {
			id: socket.lobby.id,
			x: socket.game.x,
			y: socket.game.y
		});
	});
	//click
}

var stopGame = function(){
	for(var i=0;i<state.sockets;i++){
		io.removeAllListeners("");
	}
	state.currentState = GAME_STATE.LOBBY;
}

exports.startGame = startGame;
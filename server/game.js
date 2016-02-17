var state = require("./state");
var GAME_STATE = require("./models/GAME_STATE");
var ROLE = require("./models/ROLE");
var Jailer = require("./models/Jailer");
var Ape = require("./models/Ape");

var io;
exports.attachIO = function(newio){
	io = newio;
}

var startGame = function(){
	console.log("Starting game...");
	state.currentState = GAME_STATE.GAME;

	var ape = Math.floor(Math.random()*(state.sockets.length-1));

	//TODO there might be a better way to attach all this jazz
	for(var i=0;i<state.sockets.length;i++){
		if(i==ape){
			attachApe(state.sockets[i]);
			state.sockets[i].emit("role", ROLE.APE);
		} else {
			attachJailer(state.sockets[i]);
			state.sockets[i].emit("role", ROLE.JAILER);
		}
	}
	io.emit("start_game", state.sockets.length);
}

var attachApe = function(socket){
	socket.game = new Ape();
	socket.on("move", function(position){
		//socket.game.x = position.x;
		//socket.game.y = position.y;
		socket.broadcast.emit("ape:move", position);
	});
	//powerup
	//death
	//teleporter --> state.currentLevel++
}

var attachJailer = function(socket){
	socket.game = new Jailer();
	socket.on("move", function(position){
		socket.game.x = position.x;
		socket.game.y = position.y;
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
		io.removeAllListeners("move");
	}
	state.currentState = GAME_STATE.LOBBY;
	io.emit("end_game", state.currentState);
}

exports.startGame = startGame;
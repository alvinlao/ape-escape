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
		socket.broadcast.emit("move", position);
	});

	socket.on("powerup", function(powerup){
		console.log("powerup used: " + powerup.type);
		socket.broadcast.emit("powerup", powerup);
	});

  socket.on("death", function(causeofdeath) {
    console.log("ape died: " + causeofdeath);
		socket.broadcast.emit("death", causeofdeath);
  });

  socket.on("grabpowerup", function(powerupid) {
    console.log("ape grabbed powerup: " + powerupid);
		socket.broadcast.emit("grabpowerup", powerupid);
  });

	// TODO teleporter --> state.currentLevel++
  socket.on("teleport", function(levelIndex) {
    console.log("new level: " + levelIndex);
    socket.broadcast.emit("teleport", levelIndex);
  });
}

var attachJailer = function(socket){
	socket.game = new Jailer();
  // TODO rename event to guard:move
  // TODO rename event to guard:click
  /*
	socket.on("move", function(position){
		socket.game.x = position.x;
		socket.game.y = position.y;
		socket.broadcast.emit("jailer:move", {
			id: socket.lobby.id,
			x: socket.game.x,
			y: socket.game.y
		});
	});
  */
	//click
  
  socket.on("trap_click", function(trapid) {
    // TODO trap logic
    // Right now: one click = activate
    console.log("trap activated: " + trapid);
    io.emit("trap_activate", trapid);
  });
}

var stopGame = function(){
	for(var i=0;i<state.sockets;i++){
		io.removeAllListeners("move");
	}

  // TODO: put all players back in unready queue
	state.currentState = GAME_STATE.LOBBY;
	io.emit("end_game", state.currentState);
}

exports.startGame = startGame;

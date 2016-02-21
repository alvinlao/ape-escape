var lobby = require("./lobby");
var GAME_STATE = require("./models/GAME_STATE");
var state = require("./state");

var attachIO = function(io){
	lobby.attachIO(io);
	console.log("IO attached.");
	state.currentGameState = GAME_STATE.LOBBY;

	io.on("connection", function(socket){
		console.log("User connected");
		state.sockets.push(socket);

		socket.on("disconnect", function(){
			console.log("User disconnected");
			//Remove it from the array
			state.sockets.splice(state.sockets.indexOf(socket), 1);
      lobby.leaveLobby(this);
		});

    socket.on("join_lobby", function(name) {
      console.log("'" + name + "' joined the lobby");
      lobby.joinLobby(this, name);
    });
	});
}

exports.attachIO = attachIO;

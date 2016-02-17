var lobby = require("./lobby");
var GAME_STATE = require("./models/GAME_STATE");
var state = require("./state");

var attachIO = function(io){
	lobby.attachIO(io);
	console.log("IO attached.");
	state.currentGameState = GAME_STATE.LOBBY;

	io.on("connection", function(socket){
		state.sockets.push(socket);

		console.log("User connected");
		lobby.joinLobby(socket);

		socket.on("disconnect", function(){
			console.log("User disconnected");
			//Remove it from the array
			state.sockets.splice(state.sockets.indexOf(socket), 1);
		});
	});
}

exports.attachIO = attachIO;
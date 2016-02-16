var LobbyMember = require("./models/LobbyMember");
var game = require("./game");
var state = require("./state");

var io;
exports.attachIO = function(newio){
	io = newio;
	game.attachIO(io);
};

var joinLobby = function(socket){
	socket.lobby = new LobbyMember(socket);

	//Lobby Handlers
	var playerReady = function(){
		newMember.ready = true;
		console.log("Player " + newMember.name + " is ready.");
		io.emit("lobby", lobby);

		//Start the game if we're ready
		if(isReady(lobby)) startGame();
	}

	//Attach the lobby handlers
	socket.on("player_ready", playerReady);

	emitLobby();
}

var startGame = function(){
	game.start();
}

var isReady = function(lobby){
	for(var i=0;i<state.sockets.length;i++){
		if(!state.sockets.lobby.ready){
			return false;
		}
	}
	return true;
}

var emitLobby = function(){
	io.emit("lobby", state.sockets.map(function(a){return a.lobby}));
}

exports.joinLobby = joinLobby;
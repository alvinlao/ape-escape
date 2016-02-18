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
	console.log(socket.lobby);

	//Lobby Handlers
	var playerReady = function(){
		socket.lobby.ready = true;
		console.log("Player " + socket.lobby.name + " is ready.");
		
		emitLobby();

		//Start the game if we're ready
		if(isReady()){
			console.log("ready!");
			startGame();
		} else {
			console.log("not ready!");
		}
	}

	var setName = function(newName){
		console.log("Player " + socket.lobby.name + " has changed their name to " + newName);
		socket.lobby.name = newName;

		emitLobby();
	}

	//Attach the lobby handlers
	socket.on("player_ready", playerReady);
	socket.on("player_name", setName);

	emitLobby();
}

var leaveLobby = function(){
	emitLobby();
}

var startGame = function(){
	game.startGame();
}

var isReady = function(){
	for(var i=0;i<state.sockets.length;i++){
		if(!state.sockets[i].lobby.ready){
			return false;
		}
	}
	return true;
}

var emitLobby = function(){
	io.emit("lobby", state.sockets.map(function(a){return a.lobby}));
}

exports.joinLobby = joinLobby;
exports.leaveLobby = leaveLobby;
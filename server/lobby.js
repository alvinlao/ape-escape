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
	var playerReady = function(role){
		socket.lobby.ready = true;
    socket.lobby.role = role;
		console.log("Player " + socket.lobby.name + " is ready (" + role + ").");
		
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
  // Pick ape
  var apeCandidates = [];
  for (var i = 0; i < state.sockets.length; i++) {
    var socket = state.sockets[i];

    if (socket.lobby.role === 'ape') {
      apeCandidates.push(socket);
    }
  }

  // No one wants to be the ape
  if (apeCandidates.length === 0) {
    apeCandidates = state.sockets;
  }

  var apeIndex = Math.floor(Math.random() * (apeCandidates.length - 1));
  apeCandidates[apeIndex].lobby.isApe = true;

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

exports.currentGameState = 0;
exports.sockets = []; //Array of io sockets

/*
	Each socket also has two additional properties
		lobby (LobbyMember)
		game (GameMember - Ape or Jailer)
*/
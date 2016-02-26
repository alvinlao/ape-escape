exports.currentState = 0;
exports.sockets = []; //Array of io sockets
exports.currentLevel = 0;

/*
	Each socket also has two additional properties
		lobby (LobbyMember)
		game (GameMember - Ape or Jailer)
*/

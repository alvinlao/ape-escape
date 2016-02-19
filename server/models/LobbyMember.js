var lobbyId = 0;

var LobbyMember = function(){
	if(lobbyId == 9007199254740992) lobbyId = 0;

	this.id = ++lobbyId;
	this.name = "";
	this.ready = false;
  this.role = "";
}

module.exports = LobbyMember;

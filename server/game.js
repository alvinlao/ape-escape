var config = require('../common/config');
var map = require('./map');

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
  state.mapTraps = map.parseTraps();
  state.currentLevelIndex = 0;

	var ape = Math.floor(Math.random()*(state.sockets.length-1));
  var apeName;

	//TODO there might be a better way to attach all this jazz
	for(var i=0;i<state.sockets.length;i++){
    var socket = state.sockets[i];
    if (socket.lobby.isApe) {
			attachApe(socket);
			state.sockets[i].emit("role", ROLE.APE);
      apeName = socket.lobby.name;
    } else {
			attachJailer(socket);
			state.sockets[i].emit("role", ROLE.JAILER);
    }
	}

  var numGuards = state.sockets.length - 1;
  map.populateTraps(state.mapTraps, numGuards);

  var guards = state.sockets.filter(function(socket){
    //Filter for guards
    if(socket.game.role === ROLE.JAILER){
      return true;
    } else {
      return false;
    }
  }).map(function(s){
    return {
      id: s.lobby.id,
      name: s.lobby.name
    }
  });

	io.emit("start_game", {
    guards: guards,
    mapTraps: state.mapTraps,
    apeName: apeName
  });
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

  socket.on("grabpowerup", function(powerup) {
    console.log("ape grabbed powerup: " + powerup.powerupid);
		socket.broadcast.emit("grabpowerup", powerup);
  });

	// TODO teleporter --> state.currentLevel++
  socket.on("teleport", function(levelIndex) {
    console.log("new level: " + levelIndex);

    state.currentLevelIndex = levelIndex;

    // TODO Message all guards
    socket.broadcast.emit("teleport", levelIndex);
  });
}

var attachJailer = function(socket){
	socket.game = new Jailer();
  // TODO rename event to guard:move
  // TODO rename event to guard:click
  /*
	socket.on("guard:move", function(position){
		socket.game.x = position.x;
		socket.game.y = position.y;
		socket.broadcast.emit("guard:move", {
			id: socket.lobby.id,
			x: socket.game.x,
			y: socket.game.y
		});
	});
  */
	//click
  
  socket.on("trap_click", function(trapid) {
    var mapTraps = state.mapTraps[state.currentLevelIndex];
    if (trapid in mapTraps) {
      var trap = mapTraps[trapid];

      // Decrement
      if (trap.clicksLeft > 0) {
        trap.clicksLeft -= 1;
        io.emit("traps_update", mapTraps);

        // Activated
        if (trap.clicksLeft === 0) {
          console.log("trap activated: " + trapid);
          io.emit("trap_activate", trapid);
        }
      }
    }
  });
}

var stopGame = function(){
	for(var i=0; i<state.sockets.length; i++){
		io.removeAllListeners("move");
    io.removeAllListeners("powerup");
    io.removeAllListeners("death");
    io.removeAllListeners("grabpowerup");
    io.removeAllListeners("teleport");
    io.removeAllListeners("trap_click");
  }

  // TODO: put all players back in unready queue
	state.currentState = GAME_STATE.LOBBY;
	io.emit("end_game", state.currentState);
}

exports.startGame = startGame;

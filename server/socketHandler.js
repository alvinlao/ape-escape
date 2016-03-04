var lobby = require("./lobby");
var GAME_STATE = require("./models/GAME_STATE");
var state = require("./state");

var attachIO = function(io){
    lobby.attachIO(io);
    console.log("IO attached.");
    setTimeout(function(){
        state.currentState = GAME_STATE.LOBBY;
    },3000);

    io.on("connection", function(socket){
        if(state.currentState === GAME_STATE.LOADING){
            //Haven't finished loading yet.
            socket.emit("end_game", state.currentState);
            socket.emit("state", state.currentState);
        }
        console.log("User connected");
        state.sockets.push(socket);

        socket.on("disconnect", function(){
            console.log("User disconnected");
            //Remove it from the array
            state.sockets.splice(state.sockets.indexOf(socket), 1);
            lobby.leaveLobby(this);
        });
        socket.on("get_state", function(){
            console.log("Current state: " + state.currentState);
            socket.emit("state", state.currentState);
        });
        socket.on("join_lobby", function(name) {
            console.log("'" + name + "' joined the lobby");
            lobby.joinLobby(this, name);
        });
    });
}

exports.attachIO = attachIO;

var express = require("express");
var socket_io = require("socket.io");
var http = require("http");

var config = require("./config");
var socketHandler = require("./socketHandler");


var apeApp = express();
var apeServer = http.createServer(apeApp);

//Serve static files
apeApp.use(express.static("../public"));
apeApp.use("/common", express.static("../common"));

//Start socket.io
var io = socket_io().attach(apeServer);
socketHandler.attachIO(io);

//Start the server
apeServer.listen(config.PORT, function(){
    console.log(""
        +"     _                 _____                            " + "____  \n"
        +"    / \\   _ __   ___  | ____|___  ___ __ _ _ __   ___  " + "|___ \\ \n"
        +"   / _ \\ | '_ \\ / _ \\ |  _| / __|/ __/ _` | '_ \\ / _ \\   " + "__) |\n"
        +"  / ___ \\| |_) |  __/ | |___\\__ \\ (_| (_| | |_) |  __/  " + "/ __/ \n"
        +" /_/   \\_\\ .__/ \\___| |_____|___/\\___\\__,_| .__/ \\___| " + "|_____|\n"
        +"         |_|                              |_|                 "
    );
    console.log("Ape Escape 2 started on port " + config.PORT);
});
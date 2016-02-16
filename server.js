var express = require("express");
var config = require("./server/config");

var apeApp = express();

apeApp.use(express.static("public"));

apeApp.listen(config.PORT, function(){
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
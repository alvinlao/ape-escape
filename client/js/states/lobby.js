var config = require('../util/config.js');
var player = require('../util/player.js');
var spritesheets = require('../util/spritesheets.js');
var buttonconfig = require('../util/buttonconfig.js');
var STATE = require('../util/state.js');

var TextButton = require('../sprites/textbutton.js');
var Button = require('../sprites/button.js');

class LobbyState extends Phaser.State {
  create() {
    super.create();

    var game = this.game;

    var apebuttonwidth = 128;
    var zookeepberbuttonwidth = 256;
    var gutter = 10;
    var titleYOffset = -50;
    var buttonYOffset = 50;

    var width = apebuttonwidth + zookeepberbuttonwidth + gutter;

    var x = config.CANVAS_WIDTH / 2 - (width / 2) + (apebuttonwidth / 2);
    var y = config.CANVAS_HEIGHT / 2 + buttonYOffset;

    // Lobby
    var style = { font: "72px Arial", fill: "#253659", align: "center" };
    var title = game.add.text(config.CANVAS_WIDTH / 2 + 0.5, config.CANVAS_HEIGHT / 2 + titleYOffset, "Lobby", style);
    title.anchor.set(0.5);

    // Buttons
    var apeButton = new TextButton(
        game,
        x,
        y,
        spritesheets.bluebutton2.name,
        'ape',
        buttonconfig.BLUE_STYLE,
        Phaser.KeyCode.Z,
        function() {
            this.game.socket.emit("player_ready");
          //this.game.state.start('level', true, false, player.APE);
        },
        this
      );

    x += (apebuttonwidth / 2) + gutter + (zookeepberbuttonwidth / 2);

    var zooKeeperButton = new TextButton(
        game,
        x,
        y,
        spritesheets.redbutton4.name,
        'zoo keeper',
        buttonconfig.RED_STYLE,
        Phaser.KeyCode.X,
        function() {
            this.game.socket.emit("player_ready");
          //this.game.state.start('level', true, false, player.ZOOKEEPER);
        },
        this
      );

    this.game.socket.on("role", function(newRole){
        console.log("Role selected: " + newRole);
        game.player = newRole;
    });

    this.game.socket.on("state", function(state){
        if(state === STATE.GAME){
            game.state.start("level", true, false, game.player);
        }
    });
  }
}

module.exports = LobbyState;

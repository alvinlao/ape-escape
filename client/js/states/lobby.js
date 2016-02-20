var config = require('../util/config.js');
var spritesheets = require('../util/spritesheets.js');
var buttonconfig = require('../util/buttonconfig.js');
var STATE = require('../util/state.js');
var ROLE = require('../util/role.js');

var TextButton = require('../sprites/textbutton.js');
var Button = require('../sprites/button.js');

class LobbyState extends Phaser.State {
  create() {
    super.create();

    var game = this.game;

    var apebuttonwidth = 128;
    var zookeepberbuttonwidth = 128;
    var gutter = 10;
    var titleYOffset = -50;
    var buttonYOffset = 30;

    var width = apebuttonwidth + zookeepberbuttonwidth + gutter;

    var x = config.CANVAS_WIDTH / 2 - (width / 2) + (apebuttonwidth / 2);
    var y = config.CANVAS_HEIGHT / 2 + buttonYOffset;

    // Lobby
    var style = { font: "72px Arial", fill: "#253659", align: "center" };
    var title = game.add.text(config.CANVAS_WIDTH / 2 + 0.5, config.CANVAS_HEIGHT / 2 + titleYOffset, "Lobby", style);
    title.anchor.set(0.5);

    // Lobby players
    var lobbyDiv = document.getElementById('lobby');
    this.lobbyDiv = lobbyDiv;
    this.lobbyDiv.style.display = 'block';

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
            this.game.socket.emit("player_ready", 'ape');
        },
        this
      );

    x += (apebuttonwidth / 2) + gutter + (zookeepberbuttonwidth / 2);

    var zooKeeperButton = new TextButton(
        game,
        x,
        y,
        spritesheets.redbutton2.name,
        'guard',
        buttonconfig.RED_STYLE,
        Phaser.KeyCode.X,
        function() {
            this.game.socket.emit("player_ready", 'guard');
        },
        this
      );

    this.game.socket.on("role", function(newRole){
        console.log("Role selected: " + newRole);
        game.role = newRole;
    });

    this.game.socket.on("start_game", function(numGuards){
      lobbyDiv.style.display = "none";
      if (game.role === ROLE.APE) {
        game.state.start("apelevel", true, false, numGuards);
      } else {
        game.state.start("guardlevel", true, false, numGuards);
      }
    });

    // Initialize lobby with me
    this.drawLobby([{ name: this.game.playerName, ready: false, role: '' }]);

    this.game.socket.on("lobby", this.drawLobby.bind(this));
  }

	// @param player { name: string, ready: bool, role: { 'ape' | 'guard' | '' } }
  drawPlayer(player) {
    var name = player.name;
    var ready = player.ready;
    var role = player.role;

    if (!ready) role = '';

    var playerDiv = `
        <div class="player ${role}">
          <div class="info">
            <div class="status"></div>
            <div class="name">${name}</div>
          </div>
        </div>
    `

    this.lobbyDiv.innerHTML += playerDiv;
  }

  // @param players (object)
  drawLobby(players) {
    // Clear the div
    while (this.lobbyDiv.firstChild) {
      this.lobbyDiv.removeChild(this.lobbyDiv.firstChild);
    }

    // Add all players
    players.forEach(function(player) {
      this.drawPlayer(player);
    }, this);
  }
}

module.exports = LobbyState;

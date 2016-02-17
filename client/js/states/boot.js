class BootState extends Phaser.State {
  create() {
    super.create();

    var game = this.game;
    game.stage.backgroundColor = "#FFFFFF";
    game.stage.disableVisibilityChange = true;

    // Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 2500;
    game.physics.arcade.TILE_BIAS = 40;
    game.time.deltaCap = 0.2;

    // Performance
    game.time.desiredFps = 60;

		game.state.start('load');
  }
}

module.exports = BootState;

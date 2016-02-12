var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.spritesheet('ape', 'assets/ape_spritesheet.png', 50, 50);
}

function create() {
  game.stage.backgroundColor = "#FFFFFF";
  game.add.sprite(0, 0, 'ape');
}

function update() {
}

console.log('hello');

//var Trap = require('./traps/trap.js');
//var FireTrap = require('./traps/firetrap.js');
//var DropTrap = require('./traps/droptrap.js');
//var LaserTrap = require('./traps/lasertrap.js');

class Map extends Phaser.Tilemap {
  constructor(game, mapName, tilesetNames) {
    super(game, mapName);

    for (var i = 0; i < tilesetNames.length; i++) {
      this.addTilesetImage(tilesetNames[i]);
    }

    this.createdLayers = {};

    this.layers.forEach(function (layer) {
      var name = layer.name;
      this.createdLayers[name] = this.createLayer(layer.name);

      if (name === 'trap_activators') {
        this.buildTraps(layer);
      }

      // Find all non-blank tiles
      if (layer.properties.collision) {
        var collisionTiles = [];
        layer.data.forEach(function (data_row) {
          data_row.forEach(function (tile) {
            // Only want unique non-blank tiles
            if (tile.index > 0 && collisionTiles.indexOf(tile.index) === -1) {
              collisionTiles.push(tile.index);
            }
          }, this);
        }, this);
        this.setCollision(collisionTiles, true, layer.name);
      }
    }, this);
  }

  buildTraps(layer) {
    /*
    mapTile(layer, function(tile, x, y) {
      var trap;

      if (tile.properties.name) {
        var name = tile.properties.name;

        switch(name) {
          case "drop":
            trap = new DropTrap();
            break;
          case "fire":
            trap = new FireTrap();
            break;
          case "laser":
            trap = new LaserTrap();
            break;
          default:
            console.warn("Invalid trap activator name: " + name);
            break;
        }
      } else {
        console.warn("Trap activator missing property: 'name'");
      }
    }, this);
    */
  }
}

// Iterate through each tile and apply function
function mapTile(layer, f, context) {
  layer.data.forEach(function (data_row, y) {
    data_row.forEach(function (tile, y) {
      if (tile.index > 0) {
        f(tile, x, y);
      }
    });
  }, this);
}

module.exports = Map;

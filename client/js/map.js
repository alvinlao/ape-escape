var FireTrapActivator = require('./traps/firetrapactivator.js');

var Trap = require('./traps/trap.js');
var FireTrap = require('./traps/firetrap.js');
var DropTrap = require('./traps/droptrap.js');
var LaserTrap = require('./traps/lasertrap.js');

// TODO: Remove this
var numJailers = 10;

class Map extends Phaser.Tilemap {
  constructor(game, mapName, tilesetNames, numPlayers) {
    super(game, mapName);

    this.numPlayers = numPlayers;

    for (var i = 0; i < tilesetNames.length; i++) {
      this.addTilesetImage(tilesetNames[i]);
    }

    this.createdLayers = {};

    this.layers.forEach(function (layer) {
      var name = layer.name;
      this.createdLayers[name] = this.createLayer(layer.name);

      if (typeof layer.properties.display !== 'undefined' &&
          layer.properties.display === 'false') {
        this.createdLayers[name].visible = false;
      }

      if (name === 'trap_activators') {
        this.buildTraps(layer);
      }

      // Find all non-blank tiles
      if (typeof layer.properties.collision !== 'undefined' &&
          layer.properties.collision === 'true') {
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
    mapTile(layer, function(tile, x, y) {
      var trap;

      if (typeof tile.properties.type !== 'undefined') {
        var type = tile.properties.type;

        switch(type) {
          case "drop":
            //trap = new DropTrap(this.numPlayers);
            break;
          case "fire":
            //trap = new FireTrap(this.game, 0, 0);
            trap = new FireTrapActivator(this.game, tile.worldX, tile.worldY, numJailers);
            break;
          case "laser":
            //trap = new LaserTrap();
            break;
          default:
            console.warn("Invalid trap activator type: " + type);
            break;
        }
      } else {
        console.warn("Trap activator missing property: 'type'");
      }
    }, this);
  }
}

// Iterate through each tile and apply function
function mapTile(layer, f, context) {
  layer.data.forEach(function (data_row, y) {
    data_row.forEach(function (tile, x) {
      if (tile.index > 0) {
        f.call(this, tile, x, y);
      }
    }, this);
  }, context);
}

module.exports = Map;

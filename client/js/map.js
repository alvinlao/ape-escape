var FireTrapActivator = require('./traps/firetrapactivator.js');


// TODO: Remove this
var numJailers = 1;

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

      // display property
      if (typeof layer.properties.display !== 'undefined' &&
          layer.properties.display === 'false') {
        this.createdLayers[name].visible = false;
      }

      // collision property
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

      // Trap activator layer
      if (name === 'trap_activators') {
        this.buildTraps(layer);
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
            break;
          case "fire":
            trap = new FireTrapActivator(this.game, tile.worldX, tile.worldY, numJailers);
            break;
          case "laser":
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

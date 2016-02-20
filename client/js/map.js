var ROLE = require('./util/role.js');

var FireTrap = require('./entities/traps/firetrap.js');
var DropTrap = require('./entities/traps/droptrap.js');
var LaserTrap = require('./entities/traps/lasertrap.js');

var FireTrapActivator = require('./entities/traps/firetrapactivator.js');
var DropTrapActivator = require('./entities/traps/droptrapactivator.js');
var LaserTrapActivator = require('./entities/traps/lasertrapactivator.js');

var Teleporter = require('./entities/teleporter.js');

class Map extends Phaser.Tilemap {
  constructor(game, mapName, levelIndex, tilesetNames) {
    super(game, mapName);

    this.levelIndex = levelIndex;

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

      // Powerups
      if (name === 'powerups') {
        var powerups = [];
        mapTile(layer, function(tile, x, y) {
          powerups.push(tile);
        }, this);

        this.game.ape.addPowerups(powerups);
      }

      // Trap activator layer
      if (name === 'trap_activators') {
        this.game.traps.add(this.buildTraps(layer), this.game.gameState.mapTraps[this.levelIndex]);
      }

      // Teleporter
      if (name === 'teleporters') {
        mapTile(layer, function(tile, x, y) {
          tile.alpha = 0;
          tile.teleporter = new Teleporter(this.game, tile.worldX, tile.worldY);
        }, this);
      }
    }, this);

    // Remove powerup sprite from the map
    this.game.ape.onGrabPowerup.add(this.removePowerup, this);
  }

  buildTraps(layer) {
    var traps = [];

    mapTile(layer, function(tile, x, y) {
      var trap;

      if (typeof tile.properties.type !== 'undefined') {
        var type = tile.properties.type;

        switch(type) {
          case "drop":
            var x = tile.x;
            var y = tile.y;

            if (this.game.role === ROLE.APE) {
              trap = new DropTrap(this.game, tile.worldX, tile.worldY);
            } else if (this.game.role === ROLE.GUARD) {
              trap = new DropTrapActivator(this.game, tile.worldX, tile.worldY);
            }
            break;
          case "fire":
            if (this.game.role === ROLE.APE) {
              trap = new FireTrap(this.game, tile.worldX, tile.worldY);
            } else if (this.game.role === ROLE.GUARD) {
              trap = new FireTrapActivator(this.game, tile.worldX, tile.worldY);
            }
            break;
          case "laser":
            var direction = tile.properties.direction;
            var length = parseInt(tile.properties.length);

            if (this.game.role === ROLE.APE) {
              trap = new LaserTrap(this.game, tile.worldX, tile.worldY, direction, length);
            } else if (this.game.role === ROLE.GUARD) {
              trap = new LaserTrapActivator(this.game, tile.worldX, tile.worldY, direction, length);
            }
            break;
          default:
            console.warn("Invalid trap activator type: " + type);
            break;
        }

        traps.push(trap);
      } else {
        console.warn("Trap activator missing property: 'type'");
      }
    }, this);

    return traps;
  }

  destroy() {
    this.game.ape.onGrabPowerup.remove(this.removePowerup, this);
    super.destroy();
  }

  removePowerup(powerupid) {
    if (!(powerupid in this.game.ape.powerups)) {
      console.warn("Unable grab powerup [" + powerupid + "]");
      return;
    }

    var powerup = this.game.ape.powerups[powerupid];
    this.removeTile(powerup.x, powerup.y, this.createdLayers['powerups']);
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

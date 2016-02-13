class Map extends Phaser.Tilemap {
  constructor(game, mapName, tilesetName) {
    super(game, mapName);

    this.addTilesetImage(tilesetName);

    this.createdLayers = {};

    this.layers.forEach(function (layer) {
      var name = layer.name;
      this.createdLayers[name] = this.createLayer(layer.name);

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
}

module.exports = Map;

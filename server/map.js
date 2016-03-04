var fs = require('fs');
var tmx = require('tmx-parser');
var config = require('../common/config');

function parseTraps() {
  var mapTraps = {};

  // Global amongst different maps to avoid slow trap updates
  // affecting subsequent maps
  var trapid = 0;

  for (var i = 0; i < config.LEVELS.length; i++) {
    var levelFile = '../common/maps/' + config.LEVELS[i] + '.tmx';
    var contents = fs.readFileSync(levelFile, 'utf8');

    tmx.parse(contents, levelFile, function (err, map) {
      if (err) throw err;

      var traps = {};

      // Grab the trap activators
      map.layers.forEach(function(layer) {
        if (layer.name === 'trap_activators') {
          layer.tiles.forEach(function(tile) {
            traps[trapid] = {
              clicksLeft: 0,
              type: tile.properties.type
            }

            trapid += 1;
          }, this);
        }
      }, this);

      mapTraps[i] = traps;
    });
	}
  return mapTraps;
}

function populateTraps(mapTraps, numGuards) {
  for (var index in mapTraps) {
    var traps = mapTraps[index];

    for (var trapid in traps) {
      var trapType = traps[trapid].type;
      var clicksLeft = 0;

      switch (trapType) {
        case 'laser':
          clicksLeft = laserTrapClicks(numGuards);
          break;
        case 'fire':
          clicksLeft = fireTrapClicks(numGuards);
          break;
        case 'drop':
          clicksLeft = dropTrapClicks(numGuards);
          break;
      }

      traps[trapid].clicksLeft = clicksLeft;
    }
  }
}

function playerLeave(mapTraps, guardsLeft){

	var scaleFactor = guardsLeft/(guardsLeft+1);

	for(var index in mapTraps){
		var traps = mapTraps[index];

		for(var trapid in traps){
			traps[trapid].clicksLeft = Math.ceil(traps[trapid].clicksLeft * scaleFactor);
		}
	}
}

function laserTrapClicks(numGuards) {
  return 12 * numGuards;
}

function dropTrapClicks(numGuards) {
  return 8 * numGuards;
}

function fireTrapClicks(numGuards) {
  return 5 * numGuards;
}

exports.parseTraps = parseTraps;
exports.populateTraps = populateTraps;
exports.playerLeave = playerLeave;
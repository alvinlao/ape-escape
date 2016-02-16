var config = require('../config.js');
var spritesheets = require('../spritesheets.js');

var Trap = require('./trap.js');
var LaserHead = require('./laserhead.js');

var LASER_DURATION = config.TRAPS.LASER.DURATION;

class LaserTrap extends Trap {
  constructor(game, x, y, direction, length) {
    super(game, x, y);

    this.direction = direction;
    this.length = length + 1;

    this.sections = [];
  }

  activate() {

    var orientation;
    switch (this.direction) {
      case 'left':
        orientation = this.getLeftOrientation();
        break;
      case 'right':
        orientation = this.getRightOrientation();
        break;
      case 'up':
        orientation = this.getUpOrientation();
        break;
      case 'down':
        orientation = this.getDownOrientation();
        break;
      default:
        console.warn('Invalid laser trap direction: ' + direction);
        break;
    }

    for (var i = 0; i < orientation.loc.length; i++) {
      var loc = orientation.loc[i];

      // Create section
      var section = this.game.add.sprite(loc.x, loc.y, spritesheets.misc.name);


      // Sprite setup
      if (i === orientation.loc.length - 1) {
        // Last section
        section.frame = 1;
        this.head = new LaserHead(this.game, loc.x, loc.y, orientation.rotation);
      } else {
        section.frame = 0;
      }

      section.anchor.setTo(0.5);
      section.angle += orientation.rotation;

      // Physics
      this.game.physics.enable(section, Phaser.Physics.ARCADE);
      section.body.allowGravity = false;
      section.body.immovable = true;

      // Add section
      this.sections.push(section);
      this.game.getActiveTraps().add(section);
    }

    this.head.activate();

    super.activate();
    this.visible = false;

    // Deactivate timer
    this.game.time.events.add(
        Phaser.Timer.SECOND * LASER_DURATION,
        function() {
          this.deactivate();
        },
        this);
  }

  deactivate() {
    // Deactivate sections
    for (var i = 0; i < this.sections.length; i++) {
      var section = this.sections[i];

      section.visible = false;
      this.game.getActiveTraps().remove(section, true);

      this.head.deactivate();
    }

    this.sections = null;

    super.deactivate();
  }

  getLeftOrientation() {
    var orientation = {
      loc: [],
      rotation: 180
    };

    for (var i = 1; i < this.length; i++) {
      orientation.loc.push({
        x: this.x - (i * config.TILE_SIZE),
        y: this.y
      });
    }

    return orientation;
  }

  getRightOrientation() {
    var orientation = {
      loc: [],
      rotation: 0
    };

    for (var i = 1; i < this.length; i++) {
      orientation.loc.push({
        x: this.x + (i * config.TILE_SIZE),
        y: this.y
      });
    }

    return orientation;
  }

  getDownOrientation() {
    var orientation = {
      loc: [],
      rotation: 90
    };

    for (var i = 1; i < this.length; i++) {
      orientation.loc.push({
        x: this.x,
        y: this.y + (i * config.TILE_SIZE)
      });
    }

    return orientation;
  }

  getUpOrientation() {
    var orientation = {
      loc: [],
      rotation: -90
    };

    for (var i = 1; i < this.length; i++) {
      orientation.loc.push({
        x: this.x,
        y: this.y - (i * config.TILE_SIZE)
      });
    }

    return orientation;
  }
}

module.exports = LaserTrap;

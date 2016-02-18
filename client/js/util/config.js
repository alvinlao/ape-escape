module.exports = {
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 640,

  TILE_SIZE: 64,

  LEVELS: ["test", "level2", "level3"],

  PLAYER: {
    DEFAULT_NAME: "Mr. Ape"
  },

  TRAPS: {
    FIRE: {
      // In seconds
      DURATION: 1.5
    },
    LASER: {
      // In seconds
      DURATION: 1
    },
  },

  APE: {
    SPAWN_X: 100,
    SPAWN_Y: 50,
    SPEED: 350,
    JUMP_SPEED: 850,
    BLINK_DISTANCE: 100,
    SHIELD_TIME: 1.5,     // In seconds

    POWERUPS: {
      BLINK: {
        INITIAL_QUANTITY: 0,
        FRAMENUMBER: 3
      },
      SHIELD: {
        INITIAL_QUANTITY: 0,
        FRAMENUMBER: 2
      }
    },

    CONTROLS: {
      LEFT: {
        BUTTON: Phaser.KeyCode.LEFT,
        FRAMENUMBER: 8
      },
      JUMP: {
        BUTTON: Phaser.KeyCode.UP,
        FRAMENUMBER: 4
      },
      RIGHT: {
        BUTTON: Phaser.KeyCode.RIGHT,
        FRAMENUMBER: 6
      },
      BLINK: {
        BUTTON: Phaser.KeyCode.Z,
        FRAMENUMBER: 0
      },
      SHIELD: {
        BUTTON: Phaser.KeyCode.X,
        FRAMENUMBER: 2
      }
    },

    DEATH: {
      SPIKES: "You were impaled!",
      WATER: "You drowned!",
      FIRE: "You were ignited!",
      LASER: "You were vaporized!",
      DROP: "You were flattened!"
    }
  },

  TELEPORTER_TIME: 3
}

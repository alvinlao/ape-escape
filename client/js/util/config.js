module.exports = {
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 640,

  TILE_SIZE: 64,

  PLAYER: {
    DEFAULT_NAMES: ["Ape Jr.", "Mrs. Ape", "Mr. Ape", "Baby Ape", "McApe", "King Ape", "Queen Ape", "George", "Caeser", "Cornelius", "Rafiki", "Kong"]
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

  GUARD: {
    CAMERA_MOVE_SPEED: 10,
    CONTROLS: {
      LEFT: {
        BUTTON: Phaser.KeyCode.LEFT,
        FRAMENUMBER: 4
      },
      RIGHT: {
        BUTTON: Phaser.KeyCode.RIGHT,
        FRAMENUMBER: 2
      },
      UP: {
        BUTTON: Phaser.KeyCode.UP,
        FRAMENUMBER: 0
      },
      DOWN: {
        BUTTON: Phaser.KeyCode.DOWN,
        FRAMENUMBER: 6
      }
    },
    GAMEOVER: {
      DEAULT: "Game Over",
      SPIKES: "We impaled the ape!",
      WATER: "We drowned the ape!",
      FIRE: "We ignited the ape!",
      LASER: "We vaporized the ape!",
      DROP: "We flattened the ape!",
      WIN: "The ape won!"
    }
  },

  APE: {
    SPAWN_X: 100,
    SPAWN_Y: 50,

    SPEED: 350,
    JUMP_SPEED: 850,

    BLINK_DISTANCE: 100,
    SHIELD_TIME: 1.5,     // In seconds

    TELEPORT_DELAY: 1,    // In seconds

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

    GAMEOVER: {
      DEAULT: "Game Over",
      SPIKES: "You were impaled!",
      WATER: "You drowned!",
      FIRE: "You were ignited!",
      LASER: "You were vaporized!",
      DROP: "You were flattened!",
      WIN: "You won!"
    }
  },

  TELEPORTER_TIME: 3
}

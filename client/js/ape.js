var spritesheets = require('./spritesheets.js');
var config = require('./config.js');

var SPEED = config.APE.SPEED;
var JUMP_SPEED = config.APE.JUMP_SPEED;
var POWERUPS = [
  {name: 'blink', frameNumber: 3, buttonFrameNumber: 0, quantity: 3},
  {name: 'shield', frameNumber: 2, buttonFrameNumber: 2, quantity: 1}
];

var POWERUP  = {
  NONE: -1,
  BLINK: 0,
  SHIELD: 1,
};
var BLINK_DISTANCE = config.APE.BLINK_DISTANCE;

// In seconds
// NOTE: Last half second of the shield will start fading out
var SHIELD_TIME = 2;

//Entire duration of poof (in seconds)
var POOF_TIME = 0.35;

class Ape extends Phaser.Sprite {
  constructor(game, x, y, name) {
    super(game, x, y, spritesheets.ape.name);
    game.add.existing(this);

    this.anchor.setTo(0.5, 0.5);
    this.animations.add('walk', [0, 1], 10, true);
    this.animations.add('jump', [4, 5], 10, true);

    // Movement
    this.leftDownTime = -1;
    this.rightDownTime = -1;

    // Physics
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = true;

    // Input
    // NOTE: Need to add to key capture in "main.js"
    var zButton = game.input.keyboard.addKey(Phaser.KeyCode.Z);
    var xButton = game.input.keyboard.addKey(Phaser.KeyCode.X);
    zButton.onDown.add(this.powerup, this, 0, POWERUP.BLINK);
    xButton.onDown.add(this.powerup, this, 0, POWERUP.SHIELD);

    zButton.onDown.add(this.buttonDown, this, 0, POWERUP.BLINK);
    xButton.onDown.add(this.buttonDown, this, 0, POWERUP.SHIELD);
    zButton.onUp.add(this.buttonUp, this, 0, POWERUP.BLINK);
    xButton.onUp.add(this.buttonUp, this, 0, POWERUP.SHIELD);

    // Name tag
    var style = { font: "18px Arial", fill: "#000", align: "center" }
    this.nametag = game.add.text(0, -40, name, style);
    this.nametag.anchor.set(0.5);

    this.addChild(this.nametag);

    // Powerups
    this.powerupActive = false;
    //this.currentPowerup = POWERUP.SHIELD;
    this.powerupCollection = [];
    for (var i = 0; i < POWERUPS.length; i++) {
      this.powerupCollection.push(0);
    }

    // Power up icons
    this.createPowerupLegend();

    //Life
    this.isDead = false;
  }

  createPowerupLegend() {
    var margin = 20;
    var offset = 2;
    var scale = 0.7;
    var x = margin;
    var y = config.CANVAS_HEIGHT - (config.TILE_SIZE * scale) - margin;
    var delta = (config.TILE_SIZE * scale) + offset;

    this.powerupLegend = {};

    // TODO Make power ups more general
    for (var i = 0; i < POWERUPS.length; i++) {
      var powerup = {};

      // Group together
      var powerupGroup = this.game.add.group();
      powerupGroup.fixedToCamera = true;
      powerup.group = powerupGroup;

      this.powerupLegend[i] = powerup;

      // Button icon
      powerup.button = this.game.add.sprite(x, y, spritesheets.buttons.name, POWERUPS[i].buttonFrameNumber);
      powerup.button.scale.x = scale;
      powerup.button.scale.y = scale;
      powerupGroup.add(powerup.button);

      // Power up icon
      x += delta;
      powerup.icon = this.game.add.sprite(x, y, spritesheets.misc.name, POWERUPS[i].frameNumber);
      powerup.icon.scale.x = scale;
      powerup.icon.scale.y = scale;
      powerupGroup.add(powerup.icon);

      // Text Counter
      var style = { font: "28px Arial", fill: "#253659", boundsAlignV: "middle" };
      x += delta;
      powerup.text = this.game.add.text(x, y, "", style);
      this.updatePowerupLegend(i);
      powerup.text.setTextBounds(0, 0, config.TILE_SIZE, config.TILE_SIZE);
      powerup.text.scale.x = scale;
      powerup.text.scale.y = scale;
      powerupGroup.add(powerup.text);

      x += delta + (2 * offset);
    }
  }

  moveLeft() {
    this.body.velocity.x = -SPEED;
    this.scale.x = -1;
    this.nametag.scale.x = -1;
    this.animations.play('walk');
  }

  moveRight() {
    this.body.velocity.x = SPEED;
    this.scale.x = 1;
    this.nametag.scale.x = 1;
    this.animations.play('walk');
  }

  stop() {
    this.body.velocity.x = 0;

    if (this.body.onFloor() || this.body.touching.down) {
      this.frame = 3;
      this.animations.stop();
    } else {
      this.animations.play('jump');
    }
  }

  jump() {
    this.animations.play('jump');

    if (this.body.onFloor() || this.body.touching.down) {
      this.body.velocity.y = -JUMP_SPEED;
    }
  }

  isInvincible() {
    return this.powerupActive && this.powerupShield;
  }

  buttonDown(key, powerup) {
    var powerupInfo = POWERUPS[powerup];
    this.powerupLegend[powerup].button.frame = powerupInfo.buttonFrameNumber + 1;
  }

  buttonUp(key, powerup) {
    var powerupInfo = POWERUPS[powerup];
    this.powerupLegend[powerup].button.frame = powerupInfo.buttonFrameNumber;
  }

  // @param requestedPowerup (POWERUP enum)
  powerup(key, requestedPowerup) {
    if (this.isDead) return;

    switch(requestedPowerup){
      case POWERUP.SHIELD:

        if (!this.powerupActive && this.powerupCollection[POWERUP.SHIELD] > 0) {
          this.powerupCollection[POWERUP.SHIELD]--;
          this.updatePowerupLegend(POWERUP.SHIELD);

          this.powerupActive = true;
          this.powerupShield = true;

          var shieldImage = this.addChild(this.game.add.image(-32,-32, 'shield')); //TODO magic #
          this.game.time.events.add((Phaser.Timer.SECOND * SHIELD_TIME) - Phaser.Timer.HALF, function() {
            // Make the shield fade out during last half second
            var tween = this.game.add.tween(shieldImage).to( { alpha: 0 }, Phaser.Timer.HALF, Phaser.Easing.Linear.None, true, 0, 0, false);

            tween.onComplete.add(function() {
              shieldImage.destroy();
              this.powerupActive = false;
              this.powerupShield = false;
            }, this);
          }, this);
        }
        break;
      case POWERUP.BLINK:
        if (this.powerupCollection[POWERUP.BLINK] > 0) {
          this.powerupCollection[POWERUP.BLINK]--;
          this.updatePowerupLegend(POWERUP.BLINK);
          //Poof!
          var littlePoof = this.game.add.sprite(this.x - 32, this.y - 32, 'misc_spritesheet');
          littlePoof.frame = 12;
          var bigPoof = this.game.add.sprite(this.x - 32, this.y - 32,'misc_spritesheet');
          bigPoof.frame = 13;

          var bigPoofTween = this.game.add.tween(bigPoof).to({alpha: 0}, (Phaser.Timer.SECOND * POOF_TIME/2), Phaser.Easing.Linear.None,false, 0, 0, false);
          var littlePoofTween = this.game.add.tween(littlePoof).to({alpha:0}, (Phaser.Timer.SECOND * POOF_TIME/2), Phaser.Easing.Linear.None,true, 0, 0, false);
          this.game.time.events.add((Phaser.Timer.SECOND * POOF_TIME/2), function() {
            bigPoofTween.start();
            bigPoofTween.onComplete.add(function(){
              bigPoof.destroy();
              littlePoof.destroy();
            });
          });

          //Raycast and determine future location
          var gameMap = this.game.getMap();
          var blinkRay = new Phaser.Line();
          blinkRay.start.set(this.x, this.y);
          blinkRay.end.set(this.x + BLINK_DISTANCE*this.scale.x, this.y);
          var collidedTiles = gameMap.createdLayers['main'].getRayCastTiles(blinkRay, 4, true);
          //collidedTiles.append(gameMap.createdLayers['colli'])
          if(collidedTiles.length){
            if(this.scale.x === 1){
              this.x = collidedTiles[0].worldX - this.width/2;
            } else {
              this.x = collidedTiles[collidedTiles.length-1].worldX + collidedTiles[collidedTiles.length-1].width - this.width/2;
            }
          } else {
            this.x += BLINK_DISTANCE * this.scale.x;
          }

          //Move the big poof
          bigPoof.x = (this.x-32 + bigPoof.x)/2;
        }
        break;
      default:
        break;
    }
  }

  grabPowerup(powerupName, quantity){
    var newPowerup = POWERUP[powerupName];
    if(newPowerup === POWERUP.NONE) return;

    this.powerupCollection[newPowerup] += quantity;
    this.updatePowerupLegend(newPowerup);

    //this.currentPowerup = newPowerup;
  }

  updatePowerupLegend(powerupEnum) {
    var numAvailable = this.powerupCollection[powerupEnum];
    var legend = this.powerupLegend[powerupEnum];
    legend.text.setText("x" + numAvailable);

    var fade = 0.5;
    if (numAvailable <= 0) {
      legend.icon.alpha = fade;
      legend.text.alpha = fade;
    } else {
      legend.icon.alpha = 1;
      legend.text.alpha = 1;
    }
  }

  die() {
    if (!this.isInvincible()) {
      this.body.velocity.x = 0;
      this.animations.play('jump');
      this.rotation = 1.5;
      this.isDead = true;
    }
  }

  update(cursors) {
    if (!cursors) return;

    //Do nothing if dead
    if(this.isDead) return;

    if (!cursors.left.isDown) {
      this.leftDownTime = -1;
    }

    if (!cursors.right.isDown) {
      this.rightDownTime = -1;
    }

    if (cursors.left.isDown && this.leftDownTime === -1) {
      this.leftDownTime = this.rightDownTime + 1;
    }

    if (cursors.right.isDown && this.rightDownTime === -1) {
      this.rightDownTime = this.leftDownTime + 1;
    }

    if (this.leftDownTime != -1 || this.rightDownTime != -1) {
      if (this.leftDownTime > this.rightDownTime) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
    } else {
      this.stop();
    }

    if (cursors.up.isDown) {
      this.jump();
    }
  }
}

module.exports = Ape;

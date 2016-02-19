class TrapManager {
  constructor() {
    this.traps = {};
    this.nextid = 0;

    // Sent whenever a trap is clicked
    // @param trapid
    this.onTrapClick = new Phaser.Signal();

    // Sent whenever trap activators are created
    // @param { trapid: count }
    this.onTrapActivatorsCreate = new Phaser.Signal();

    // Send when a trap's clicks left needs to be updated
    // @param trapid
    // @param clicksLeft
    this.onTrapUpdate = new Phaser.Signal();

    // Send whenever a trap is activated
    // @param trapid
    this.onTrapActivate = new Phaser.Signal();


    // Listeners

    // Activate the trap
    this.onTrapActivate.add(function(trapid) {
      if (!(trapid in this.traps)) {
        console.warn("Unable to find trap [" + trapid + "]");
        return;
      }

      this.traps[trapid].activate();
    }, this);
  }

  add(traps) {
    var newtraps = {};
    // Add id to each trap
    for (var i = 0; i < traps.length; i++) {
      var trap = traps[i];
      trap.id = this.nextid;

      // Only guards have traps with clicksLeft (trap activator)
      if (typeof trap.clicksLeft !== 'undefined') {
        newtraps[this.nextid] =  trap.clicksLeft;
      }

      this.traps[this.nextid] = trap;

      this.nextid++;
    }

    if (Object.keys(newtraps).length > 0) {
      this.onTrapActivatorsCreate.dispatch(newtraps);
    }
  }

  removeAll() {
    this.traps = {};
  }
}

module.exports = TrapManager;
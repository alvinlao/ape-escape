class TrapManager {
  constructor() {
    this.traps = {};
    this.nextid = 0;

    // Sent whenever a trap is clicked
    // @param trapid
    this.onClick = new Phaser.Signal();

    // Sent when trap counts are updated
    // @param traps (obj) { trapid: (int), clicksLeft: (int) }
    this.onUpdate = new Phaser.Signal();

    // Send whenever a trap is activated
    // @param trapid
    this.onActivate = new Phaser.Signal();


    // Listeners

    // Activate the trap
    this.onActivate.add(function(trapid) {
      if (!(trapid in this.traps)) {
        console.warn("Unable to find trap [" + trapid + "]");
        return;
      }

      this.traps[trapid].activate();
    }, this);
  }

  add(traps, mapTraps) {
    // Add id to each trap
    for (var i = 0; i < traps.length; i++) {
      var trap = traps[i];
      trap.id = this.nextid;

      // Only activators have #updateClicksLeft
      if (trap.updateClicksLeft) {
        trap.updateClicksLeft(mapTraps[this.nextid].clicksLeft);
      }

      this.traps[this.nextid] = trap;

      this.nextid++;
    }
  }

  removeAll() {
    this.traps = {};
  }
}

module.exports = TrapManager;

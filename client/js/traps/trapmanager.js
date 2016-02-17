class TrapManager {
  constructor() {
    this.nextid = 0;

    // Sent whenever a trap is clicked
    // @param trapid
    this.onTrapClick = new Phaser.Signal();

    // Sent whenever trap activators are created
    // @param { trapid: count }
    this.onTrapActivatorsCreate = new Phaser.Signal();

    this.onTrapActivatorsCreate.add(function(traps) {
      console.log(traps)
    });
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

      this.nextid++;
    }

    if (Object.keys(newtraps).length > 0) {
      this.onTrapActivatorsCreate.dispatch(newtraps);
    }
  }
}

module.exports = TrapManager;

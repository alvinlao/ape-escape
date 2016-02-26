class CursorManager {
	constructor() {
		this.cursors = {};

		//Sent whenever a guard joins
		this.onJoin = new Phaser.Signal();

		//Sent whenever a guard leaves
		this.onLeave = new Phaser.Signal();

		//Sent whenever a guard's cursor moves
		this.onMove = new Phaser.Signal();


		this.onJoin.add(function(guardId){
			if(!(guardid in this.cursors)){
			} else {
				console.warn("Guard already joined!");
				return;
			}
		});
	}
}
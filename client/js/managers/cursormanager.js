class CursorManager {
  constructor() {
    this.remoteGuards = [];

    //Sent whenever a guard joins or leaves
    this.newGuardCursor = new Phaser.Signal();

    //Sent whenever a guard's cursor moves
    this.onMove = new Phaser.Signal();

    var self = this;

    this.newGuardCursor.add(function(id,sprite){
      self.remoteGuards.push({
        id: id,
        sprite: sprite
      });
    });

    this.onMove.add(function(id,x,y){
      for(var i=0;i<self.remoteGuards.length;i++){
        if(self.remoteGuards[i].id == id){
          self.remoteGuards[i].sprite.moveTo(x,y);
        }
      }
    });
  }
}

module.exports = CursorManager;
class Checkpoints {
  constructor(points) {
    this.checkpoints = [];
    if (points) {
      this.checkpoints = points;
    }
    this.r = 20;
  }
  
  create(x, y) {
    this.checkpoints.push({x,y});
  }
  
  delete() {
    this.checkpoints.pop();
  }
  
  draw() {
    if (!SHOW_CHECKPOINTS) return;
    for (let checkpoint of this.checkpoints) {
      circle(checkpoint.x, checkpoint.y, this.r);
    }
  }
  
  hit(boat) {
    if (this.checkpoints.length <= boat.currentCheckpoint) return;
    let checkpoint = this.checkpoints[boat.currentCheckpoint];
    
    
    if (dist(boat.pos.x, boat.pos.y, checkpoint.x, checkpoint.y) <= this.r + boat.r) {
      return true;
    }
    return false;
  }
  
  save() {
    saveJSON(this.checkpoints, 'points.json');
  }
  
}
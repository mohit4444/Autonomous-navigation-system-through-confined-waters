class Boat {
  constructor() {
    this.boatImg = boatImg;
    this.velocity = p5.Vector.random2D();
    
    this.r = 15;
    this.index = 0;
    this.pos = createVector(width/2-140, height - 390);
    this.s1 = createVector(width/2-180, height - 390);
    this.s0 = createVector(width/2-140, height - 390);
    this.s2 = createVector(width/2-140, height - 390);
    this.angle = 0;
    this.rotateAmount = 0;
    this.alive = true;
    this.currentCheckpoint = 0;
    this.totalDistance = 0;
    
    //this.genotype = new DNA();
    this.brain = new NeuralNetwork(4, 8, 2);
  }
  
  die() {
    this.alive = false;
  }
  
  draw() {
    if (!this.alive) return;

    
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    
    if (this.wasBest) {
      tint(0, 255, 100); 
    }
    imageMode(CENTER);
    image(boatImg, 0, 0, this.r + 10, this.r);
   
    pop();
    push();
    noStroke();
    fill(255, 0, 0)
    circle(this.s2.x, this.s2.y, 2)
    circle(this.s1.x, this.s1.y, 2)
    circle(this.s0.x, this.s0.y, 2)
    pop();
  }
  
  update() {
    if (!this.alive) return;
    const prevPos = this.pos.copy(); 
    this.pos.x -= SPEED * cos(this.angle);
	  this.pos.y -= SPEED * sin(this.angle);
    
    this.totalDistance += dist(prevPos.x, prevPos.y, this.pos.x, this.pos.y);

    // uncomment if you want real time distance calculation
    // if (this.totalDistance > bestTotalDistance) {
    //   bestTotalDistance = this.totalDistance;
    // }
    
    this.s1.x = this.pos.x - 30 * cos(this.angle);
    this.s1.y =  this.pos.y - 30 * sin(this.angle);
    
    this.s0.x = this.pos.x - 25 * cos(this.angle + PI/2);
    this.s0.y =  this.pos.y - 25 * sin(this.angle + PI/2);
    
    
    this.s2.x = this.pos.x - 25 * cos(this.angle - PI/2);
    this.s2.y =  this.pos.y - 25 * sin(this.angle - PI/2);
    // this.angle += this.genotype.genes[this.index];
    this.think();
    this.index++;
  }
  
  think() {
    let infrontCollision = 0
    const index = 4 * (floor(this.s1.y) * width + floor(this.s1.x));
    if (pixels && pixels[index] != 99 && pixels[index+1] != 111 && pixels[index+2] != 114) {
      infrontCollision = 1;
    }
    
    let rightCollision = 0
    const indexRight = 4 * (floor(this.s0.y) * width + floor(this.s0.x));
    if (pixels && pixels[indexRight] != 99 && pixels[indexRight+1] != 111 && pixels[indexRight+2] != 114) {
      rightCollision = 1;
    }
    
    let leftCollision = 0
    const indexLeft = 4 * (floor(this.s2.y) * width + floor(this.s2.x));
    if (pixels && pixels[indexLeft] != 99 && pixels[indexLeft+1] != 111 && pixels[indexLeft+2] != 114) {
      leftCollision = 1;
    }
    
    let inputs = [ this.angle, infrontCollision, rightCollision, leftCollision]
    
    const result = this.brain.predict(inputs);
    if (result[0] > result[1]) {
      this.angle += TURN_MAX;
    } else {
      this.angle -= TURN_MAX;
    }
  }
  
  calcFitness() {
    this.fitness = map(this.index, 0, 1000, 0, 1);
    this.fitness = pow(this.fitness, 4);
  }
  
  crossover(partner) {
    let childBoat = new Boat();
    childBoat.genotype = this.genotype.crossover(partner.genotype);
    return childBoat;
  }

  
  mutate(mutationRate) {
    this.genotype.mutate(mutationRate);
  }
}
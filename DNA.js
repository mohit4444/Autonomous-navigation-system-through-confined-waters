class DNA {
  
  constructor() {
    this.genes = this.createGenes();
  }
  
  
  createGenes() {
    let s = [];
    for (let j = 0; j < 10000; j++) {
       s[j] = random(-TURN_MAX, TURN_MAX);
    }
    return s;
  }
  
  calcFitness(currentCheckpoint) {
    // index is just the gene they were currently on
    // using this as an easy way to calc fitness
    // the higher the index, the further they moved the closer to the finish?
    // this.fitness = map(index, 0, 10000, 0, 1);
    
    this.fitness = map(currentCheckpoint, 0, 1000, 0, 1);
    this.fitness = pow(this.fitness, 4);
  }
  
  crossover(partner) {

    let child = new DNA();
    
    let midpoint = floor(random(this.genes.length));
    
    for (let i = 0; i < this.genes.length; i++) {
      if (i > midpoint) {
        child.genes[i] = this.genes[i];
      } 
      else {
        child.genes[i] = partner.genes[i]; 
      }
    }
    return child;
  }
  
  mutate(mutationRate) {
    for (let i = myFrameCount-400; i < this.genes.length; i++) {
      if (random(1) < mutationRate) {
         this.genes[i] = random(-TURN_MAX, TURN_MAX);
      }
    }
  }
   
}
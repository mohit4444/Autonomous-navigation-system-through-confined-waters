const TURN_MAX = 0.05;
const POPULATION_COUNT = 100;
const SPEED = 1.5;
const mutationRate = 0.05;
let population = [];
let matingPool = [];

let skip = false;
let generationCount = 0;
let myFrameCount = 0;
let track;
let boatImg;
let isFinished = false;
let best;
let trackPixels;
let bestTotalDistance = 0;


function preload() {
  track = loadImage('images/tracks/training.png');
  boatImg = loadImage('boat.png');
}

function setup() {
  createCanvas(1100, 2100);
  for (let i = 0; i < POPULATION_COUNT; i++) {
    population.push(new Boat());
  }
  goal = createVector(width / 2, 20);
  tf.setBackend('cpu');
}

// Uncomment to load the best neural network and comment the setup function above
// let model;
// async function setup() {
//   createCanvas(1100, 2100);

//   // Load the model
//   model = await tf.loadLayersModel('bestnetwork/best.json');

//   // If you want to use the best model for all boats initially
//   for (let i = 0; i < POPULATION_COUNT; i++) {
//     let boat = new Boat();
//     boat.brain.model = model;
//     population.push(boat);
//   }

//   goal = createVector(width / 2, 20);
//   tf.setBackend('cpu');
// }

function draw() {
  background(147, 204, 76);
  image(track, 0, 0)
  if (frameCount === 1) {
    loadPixels();
  }

  checkWallCollisions();

  isFinished = true;
  for (let boat of population) {
    boat.update();
    boat.draw();
    if (boat.alive) isFinished = false;
  }

  if (isFinished) {
    for (let pop of population) {
      pop.calcFitness();
    }
    naturalSelection();
    generate();
    generationCount++;
    myFrameCount = 0;
  }

  textSize(30);
  text(`Best Distance: ${(bestTotalDistance * 0.12).toFixed(2)} meters`, 25, height - 300);
  text(`Generation: ${generationCount}`, 25, height - 250);
  text(`Population: ${population.length}`, 25, height - 200);
  text(`Mutation Rate: ${mutationRate * 100}%`, 25, height - 150);
  myFrameCount++;
}

function checkWallCollisions() {
  for (let boat of population) {
    let pixelRgb = get(boat.pos.x, boat.pos.y);
    if (pixelRgb[0] !== 99) {
      boat.die();
    }
  }
}

function naturalSelection() {
  matingPool = [];
  let bestCount = 0;
  for (let pop of population) {
    let n = floor(pop.fitness * 100);
    if (n > bestCount) {
      bestCount = n;
      best = pop;
      if (best.totalDistance > bestTotalDistance) {
        bestTotalDistance = best.totalDistance;
      }
    }
    for (let i = 0; i < n; i++) {
      matingPool.push(pop);
    }
  }

  if (best) {
    for (let i = 0; i < bestCount * 4; i++) {
      matingPool.push(best);
    }
  }
}


function generate() {

  for (let i = 0; i < population.length; i++) {
    let index = floor(random(matingPool.length));
    let chosen = matingPool[index];
    let clonedBrain = chosen.brain.copy();
    let boat = new Boat();
    boat.brain = clonedBrain;
    boat.brain.mutate(mutationRate);
    population[i] = boat;
  }
}


function mousePressed() {
  checkpoints.create(mouseX, mouseY);
}

function keyPressed() {
  if (keyCode === 88) {
    best.brain.model.save('downloads://best');  //press X to save the best model
  }
}
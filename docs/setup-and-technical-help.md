# Loading setup and technical help

[Back to the user guide](../README.md)

This guide is for the person setting up the project. Everyday running, saving, and recording results are covered in the user guide. The current application has no model-loading button or track selector, so testing a saved model requires the edits below. These edits are instructions, not features already enabled in the app.

You will need a text editor. Open `sketch.js` from the project folder, keep a backup of the original file, and follow all three editing steps before refreshing the browser. If you are unfamiliar with editing code, ask the person who installed the project to do this setup with you.

## Set up saved-model testing

The repository includes two alternative tracks: [testing1.png](../images/tracks/testing1.png) and [testing2.png](../images/tracks/testing2.png). Use the following temporary edits to `sketch.js` for a single-boat evaluation that keeps the saved weights fixed. Save a copy of your training version of `sketch.js` first so you can restore it later.

### 1. Choose the track

In `preload()`, change only the track path:

```js
function preload() {
  track = loadImage('images/tracks/testing1.png');
  boatImg = loadImage('boat.png');
}
```

### 2. Load the exported network

Replace the active `setup()` with the following function. Keep only one active `setup()`; leave the old commented loading example disabled.

```js
async function setup() {
  createCanvas(1100, 2100);
  pixelDensity(1); // Sensor indexing assumes one pixel per canvas coordinate.
  noLoop(); // Wait for the saved network before starting the simulation.

  try {
    await tf.setBackend('cpu');
    const model = await tf.loadLayersModel('bestnetwork/best.json');
    const boat = new Boat();
    boat.brain.model.dispose(); // Release the unused random network.
    boat.brain.model = model;
    population = [boat];
    loop();
  } catch (error) {
    console.error('Could not load the saved model:', error);
  }
}
```

The model URL is relative to the served `index.html`. TensorFlow.js reads the JSON and fetches the weights file named in its manifest.

### 3. Disable selection and mutation during evaluation

Replace the active `draw()` with this evaluation version as well. Merely loading the model with the original `draw()` would continue selection and mutation after the boats die.

```js
function draw() {
  // p5 can draw once before the asynchronous setup has finished.
  if (population.length === 0) return;

  background(147, 204, 76);
  image(track, 0, 0);
  loadPixels(); // Read the track before drawing the boat or distance label.

  checkWallCollisions();
  const boat = population[0];
  boat.update();
  boat.draw();

  textSize(30);
  text(`Test Distance: ${(boat.totalDistance * 0.12).toFixed(2)} meters`,
       25, height - 300);

  if (!boat.alive) {
    console.log('Test finished. Distance (canvas pixels):', boat.totalDistance);
    noLoop();
  }
}
```

### 4. Run and compare

Save `sketch.js` and refresh the page. One boat should run using the saved network, and the simulation should stop when it hits a wall. The **Test Distance** label shows distance travelled using the same `0.12` conversion as the training display. Distance is not a success rate: a boat can accumulate distance by circling, and there is no implemented finish-line stop. To stop a run manually, enter `noLoop()` in the browser console.

Change the track path to `images/tracks/testing2.png` and refresh to repeat with the same model. You can also evaluate `training.png` as a baseline. Record the track, distance, and whether the boat follows the route or gets stuck circling. A good result on the training track does not guarantee a good result on a new track.

The **X** shortcut is for the training workflow; this evaluation does not populate `best`. To train again, restore your saved training version of `sketch.js`, including its original `setup()`, `draw()`, and training image path, then refresh.

## Use your own track image

Copy a PNG into `images/tracks/` and set its path in `preload()`. Start by editing a supplied track so its dimensions, colours, and starting area remain compatible:

- The supplied images are **1003 × 1726** pixels and are drawn at `(0, 0)` at their original size on a **1100 × 2100** canvas. A different size may require changes to the canvas and starting coordinates.
- Use solid, opaque **RGB `(99, 111, 114)` / `#636f72`** for navigable water. Collision and sensor logic in [sketch.js](../sketch.js) and [Boat.js](../Boat.js) compares pixel channels directly. For obstacles, choose a colour whose red, green, and blue channels all differ from the corresponding water channels. Avoid JPEG compression, colour filters, and antialiased boundaries that alter these values.
- With the default canvas, the boat starts at **`(410, 1710)`**, faces left (`angle = 0`), and needs water around its sensor positions. Preserve a usable starting area or adjust `pos`, `s0`, `s1`, `s2`, and `angle` in the `Boat` constructor.
- Keep the track at its intended pixel scale. Resizing it changes obstacle spacing relative to the boat and sensors. Ordinary photographs are not compatible track maps without preprocessing and changes to the collision logic.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| The canvas does not fit on screen | Zoom out until the full simulation is visible. |
| X throws an error or downloads nothing | Wait for `Boolean(best)` to be true, focus the page, and check the browser's download permissions. |
| Model loading fails or returns 404 | Check the browser console and Network tab. Both `bestnetwork/best.json` and the weights file named inside it must be served successfully. |
| An older model or track still appears | Confirm you replaced the files under the server's repository directory, then hard-refresh or disable cache in developer tools. |
| Boats disappear and training stops | Very low fitness can leave the mating pool empty, causing generation creation to fail. Refresh to restart with a new random population. This is a current limitation, not a deliberate pause. |
| A boat dies immediately on a custom image | Check water colour, image placement, and the starting position. |
| Sensors behave incorrectly on a high-density display | Add `pixelDensity(1)` immediately after `createCanvas()` in the training setup too; the evaluation example already includes it. |
| Clicking the canvas produces a `checkpoints` error | The current `mousePressed()` handler refers to an uninitialised checkpoint object. Clicking is not needed to train, export, or evaluate. |

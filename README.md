# Autonomous navigation system through confined waters

Watch simulated boats learn to steer through a waterway, save a promising boat's learned behaviour, and try it on another route. A **model** is the saved behaviour that controls a boat.

This guide covers running the project and collecting results. Instructions for whoever sets it up are in [Loading setup and technical help](docs/setup-and-technical-help.md).

## 1. Start the simulation

You need the project folder, Python 3, a web browser, and an internet connection. If someone has already set up and started the project for you, open [localhost:8000](http://localhost:8000).

Otherwise:

1. On this project's GitHub page, select **Code → Download ZIP**, then extract the downloaded folder.
2. Open a terminal in the extracted folder containing `index.html`. On Windows, you can right-click inside the folder and select **Open in Terminal**.
3. Enter the command below. On Windows, use `py -m http.server 8000` if `python3` is not recognised.
4. Open [localhost:8000](http://localhost:8000) in your browser. Keep the terminal open while using the project.

```sh
python3 -m http.server 8000
```

The boats start learning automatically. Zoom out in your browser if you cannot see the whole waterway and the numbers underneath it. Opening `index.html` by double-clicking it is not enough to run the project reliably.

## 2. Understand what you see

The simulation starts with 100 boats. When all boats in a round have stopped, a new round begins using variations of the better-performing boats' behaviour. Each round is called a **generation**.

| On-screen label | What it tells you |
| --- | --- |
| **Best Distance** | The highest distance recorded among the boats selected during this training session. It updates between rounds. |
| **Generation** | How many rounds have finished. The first round starts at 0. |
| **Population** | The number of boats in each round, not the number still moving. |
| **Mutation Rate** | How often the learned behaviour is allowed to change between rounds. The default is 5%; you can leave it as it is. |

You do not steer the boats yourself. Let several rounds run and watch whether the boats follow more of the route. Progress is not guaranteed to improve every round.

**Refreshing starts a new training session. Save a model before refreshing if you want to keep it.** To finish using the project, close the browser tab and press **Ctrl+C** in the terminal running the server.

## 3. Save the best model

1. Wait until at least one round has finished and **Generation** has increased above 0.
2. Bring the simulation browser window to the front and press **X** on your keyboard.
3. If the browser asks to allow multiple downloads, allow them. Two files should download: **`best.json`** and **`best.weights.bin`**.
4. Keep both files together in a folder for that experiment, for example `Run-01`. Also take a screenshot and note the generation shown when you saved.

Both files are needed to use the model again. Keep their original names, and use a separate folder for each export so you do not mix files from different runs. If your browser adds `(1)` to a filename, remove that suffix when preparing the files for loading.

**“Best” means the boat selected from a completed round.** It may not be the boat that set the highest distance earlier in the session. Save when you see a result you want to keep. A saved model preserves the boat's behaviour; it does not save the whole training session or its results history.

## 4. Load a model and try another route

You can use your own saved model or the example already included in the project's **`bestnetwork`** folder.

1. To use your own model, copy **both** saved files into `bestnetwork`. Keep a separate copy of any files you replace. To try the included example, skip this step.
2. Follow the [saved-model testing setup](docs/setup-and-technical-help.md#set-up-saved-model-testing), or have the person who installed the project do it for you. **The current app requires a small code setup here; there is no Load button.** Simply copying the files does not switch the app into testing mode.
3. Choose one of the supplied routes during that setup:

| Route file | Use it for |
| --- | --- |
| `training.png` | Check how the saved boat behaves on the route used for learning. |
| `testing1.png` | Try a different route. |
| `testing2.png` | Try a second different route. |

After setup, save the changes and refresh the browser. A single boat runs with the saved behaviour, **Test Distance** appears, and the test stops when the boat hits a wall. It does not keep learning during this test. Changing the route also requires the small edit described in the setup guide.

Watch whether the boat follows the route, hits a wall, or keeps circling. There is no automatic finish-line detection or time limit. If it keeps circling, record your observation and close the tab when your chosen observation time is over. Take a screenshot before closing it.

To return to learning with 100 boats, restore the original `sketch.js` file saved during setup and refresh. The **X** shortcut is for saving during training, not during this single-boat test.

## 5. Collect results for a dissertation or report

A useful question to investigate is: **Does behaviour learned on one waterway also work on a different waterway?**

1. **Choose a consistent procedure.** Decide how many training rounds to run before saving a model. Decide how long you will observe each test and what counts as following the route successfully. Record these choices before comparing runs.
2. **Run separate training experiments.** Refresh to begin each new experiment and give it a name such as `Run-01` or `Run-02`. Starting behaviour varies between training sessions, so report more than one experiment where practical.
3. **Keep the evidence.** For each experiment, keep both model files, the generation number, screenshots, and notes. You can also use your computer's screen recorder to capture the boat's behaviour.
4. **Test each saved model on all three supplied routes.** Use the same model and observation rules for each route. Write down the distance and what actually happened. Restarting the same saved model on the same route is a repeat check, not a newly trained model.
5. **Compare the results.** Use a spreadsheet to compare distances and observations across routes and separately trained models. Include unsuccessful runs as well as promising ones.

Copy this table into your notes or spreadsheet. Add one row per model and test route; the blank row is a template, not a result.

| Run / saved-model folder | Generation when saved | Test route | Test Distance shown | Observation time | Outcome and screenshot filename |
| --- | --- | --- | --- | --- | --- |
| … | … | … | … | … | … |

For your report, describe the training and testing procedure, show your results table and selected screenshots, then discuss where the boat performed well or struggled. Record the project version, any changed settings or route images, and the computer/browser used so someone else can understand how you obtained the results.

Keep these points in mind when interpreting results:

- **More distance does not automatically mean better navigation.** A boat can travel a long way while going in circles. Pair the distance with an observation or recording of its route.
- **The displayed “meters” use a fixed simulation scale.** Describe them as simulated distance; they are not a measurement from a real boat or a surveyed waterway.
- **Training Best Distance and Test Distance describe different things.** Use the single-boat tests to measure the particular model you saved.
- **This is a simulation.** Results show behaviour on these track images; they do not establish how a real boat would perform.

The project does not automatically export a results spreadsheet, calculate a success percentage, or produce dissertation text. Record the evidence and calculate any summary measures using your stated criteria.

## Other things you can do

- Try the included saved model before spending time training your own.
- Compare the same model on the two supplied test routes.
- Keep several models from different experiments and compare their behaviour.
- Use a custom waterway image with help from the person setting up the project. Images must follow the [track-image requirements](docs/setup-and-technical-help.md#use-your-own-track-image); an ordinary photograph will not work as a route.

## If something goes wrong

| Problem | What to try |
| --- | --- |
| The page will not open | Keep the server terminal open and use `http://localhost:8000`. If Python is missing, ask the person setting up the project to install it. |
| The waterway is too large for the screen | Zoom out in the browser. |
| X does not save anything | Wait for a round to finish, make sure the browser window is active, and check whether downloads were blocked. |
| Only one model file downloaded | Check your browser's downloads list and allow multiple downloads, then save again. You need both files from the same export. |
| The boats disappear and no new round begins | Refresh to start again. Some initial populations fail to produce a usable next round. |
| Loading a model does not work | Check that both files are in `bestnetwork`, with their original names, and that the testing setup was completed. |

For setup issues, see [Loading setup and technical help](docs/setup-and-technical-help.md).

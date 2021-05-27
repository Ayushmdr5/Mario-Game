import { createLevelLoader } from "../js/loaders/level.js";
import Timer from "../js/Timer.js";
import Display from "../js/display.js";
import { setupKeyboard } from "../js/input.js";
import { loadEntities } from "../js/entities.js";
import { loadFont } from "../js/loaders/font.js";
import { createDashboardLayer } from "../js/layers/dashboard.js";
import { createPlayerEnv, createPlayer } from "../js/player.js";
import DisplayChanger from "./DisplayChanger.js";
import { createWaitScreenLayer } from "./layers/waitscreen.js";
import { createColorLayer } from "./layers/color.js";
import ScreenController from "./ScreenController.js";

async function main(canvas) {
  const c = canvas.getContext("2d");
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
    loadEntities(audioContext),
    loadFont(),
  ]);

  const loadLevel = await createLevelLoader(entityFactory);
  const displayChanger = new DisplayChanger();
  const mario = createPlayer(entityFactory.mario());
  const input = setupKeyboard(mario);
  input.listenTo(window);

  let shoudlUpdate = false;

  async function runLevel(name) {
    shoudlUpdate = false;
    const level = await loadLevel(name);

    level.events.listen("trigger", (spec, trigger, touches) => {
      if (spec.type === "goto") {
        for (const entity of touches) {
          if (entity.player) {
            runLevel(spec.name);
            return;
          }
        }
      }
    });

    level.events.listen("restart", () => {
      mario.player.lives = 3;
      mario.player.score = 0;
      mario.player.coins = 0;
      mario.powerup.isPowerup = false

      runLevel("1");

      return;
    });

    const waitScreen = createWaitScreenLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, level);

    mario.pos.set(64, 64);
    level.entites.add(mario);
    const playerEnv = createPlayerEnv(mario);
    level.entites.add(playerEnv);

    const midScreen = new ScreenController();
    midScreen.comp.layers.push(createColorLayer("#000"));
    midScreen.comp.layers.push(dashboardLayer);
    midScreen.comp.layers.push(waitScreen);

    displayChanger.addDisplay(midScreen);

    level.comp.layers.push(dashboardLayer);

    displayChanger.addDisplay(level);

    displayChanger.runNext();
    shoudlUpdate = true;

    console.log(level.events);
  }

  const gameContext = {
    audioContext,
    videoContext: c,
    entityFactory,
    deltaTime: null,
  };

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;

    if (shoudlUpdate) {
      displayChanger.update(gameContext, mario);
    }
  };

  timer.start();
  runLevel("1");
}

const canvas = document.getElementById("canvas");

const start = () => {
  window.removeEventListener("keypress", start);
  main(canvas);
};
window.addEventListener("keypress", start);

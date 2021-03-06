import Keyboard from "../js/KeyboardState.js";

export const setupKeyboard = (mario) => {
  const input = new Keyboard();

  input.addMapping("Space", (keyState) => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });

  input.addMapping("ArrowRight", (keyState) => {
    mario.move.dir += keyState ? 1 : -1;
  });

  input.addMapping("ArrowLeft", (keyState) => {
    mario.move.dir += keyState ? -1 : 1;
  });

  return input;
};

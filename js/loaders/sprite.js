import { loadJSON, loadImage } from "../loader.js";
import SpriteSheet from "../../js/spriteSheet.js";
import { createAnimation } from "../../js/animation.js";

// creates canvas for each tile name in sprites (eg: mario, overworld)
export const loadSpriteSheet = (name) => {
  return loadJSON(`sprites/${name}.json`)
    .then((sheetSpec) =>
      Promise.all([sheetSpec, loadImage(sheetSpec.imageURL)])
    )
    .then(([sheetSpec, image]) => {
      const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

      if (sheetSpec.tiles) {
        // defining sprite image with there name and position (multiple of 16) in tileset image
        sheetSpec.tiles.forEach((tileSpec) => {
          sprites.defineTile(
            tileSpec.name,
            tileSpec.index[0],
            tileSpec.index[1]
          );
        });
      }

      if (sheetSpec.frames) {
        sheetSpec.frames.forEach((frameSpec) => {
          sprites.define(frameSpec.name, ...frameSpec.rect);
        });
      }

      if (sheetSpec.animations) {
        sheetSpec.animations.forEach((animationSpec) => {
          const animation = createAnimation(
            animationSpec.frames,
            animationSpec.frameLen
          );
          sprites.defineAnimation(animationSpec.name, animation);
        });
      }
      return sprites;
    });
};

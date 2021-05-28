import Level from "../Level.js";
import Entity from "../Entity.js";
import { createSpriteLayer } from "../layers/sprites.js";
import LevelTimer from "../characteristics/LevelTimer.js";
import { loadJSON } from "../loader.js";
import { createBackgroundLayer } from "../layers/background.js";
import { Matrix } from "../math.js";
import { loadMusicSheet } from "../loaders/music.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import Trigger from "../characteristics/Trigger.js";

function createTimer() {
  const timer = new Entity();
  timer.addCharacteristic(new LevelTimer());
  return timer;
}

function setupBehavior(level) {
  const timer = createTimer();
  level.entites.add(timer);

  level.events.listen("playtheme", () => {
    level.music.player.playTrack("main");
  });
}

function createTrigger() {
  const entity = new Entity();
  entity.addCharacteristic(new Trigger());
  return entity;
}

function setupBackground(levelSpec, level, backgroundSprites, patterns) {
  levelSpec.layers.forEach((layer) => {
    const grid = createGrid(layer.tiles, patterns);
    const backgroundLayer = createBackgroundLayer(
      level,
      grid,
      backgroundSprites
    );
    level.comp.layers.push(backgroundLayer);
    level.tileCollider.addGrid(grid);
  });
}

function setupEntities(levelSpec, level, entityFactory) {
  levelSpec.entities.forEach(({ name, pos: [x, y] }) => {
    const createEntity = entityFactory[name];
    const entity = createEntity();
    entity.pos.set(x, y);
    level.entites.add(entity);
  });
  const spriteLayer = createSpriteLayer(level.entites);
  level.comp.layers.push(spriteLayer);
}

function loadPattern(name) {
  return loadJSON(`levels/${name}.json`);
}

function setupTriggers(levelSpec, level) {
  if (!levelSpec.triggers) {
    return;
  }
  for (const triggerSpec of levelSpec.triggers) {
    const entity = createTrigger();
    entity.trigger.conditions.push((entity, touches, gc, level) => {
      level.events.emit("trigger", triggerSpec, entity, touches);
    });
    entity.size.set(64, 64);
    entity.pos.set(triggerSpec.pos[0], triggerSpec.pos[1]);
    level.entites.add(entity);
  }
}

export function createLevelLoader(entityFactory) {
  return function loadlevel(name) {
    return loadJSON(`levels/${name}.json`)
      .then((levelSpec) =>
        Promise.all([
          levelSpec,
          loadSpriteSheet(levelSpec.spriteSheet),
          loadMusicSheet(levelSpec.musicSheet),
          loadPattern(levelSpec.patternSheet),
        ])
      )
      .then(([levelSpec, backgroundSprites, musicPlayer, patterns]) => {
        const level = new Level();
        level.name = name;
        level.music.setPlayer(musicPlayer);

        // setupCollision(levelSpec, level);
        setupBackground(levelSpec, level, backgroundSprites, patterns);
        setupEntities(levelSpec, level, entityFactory);
        setupTriggers(levelSpec, level);
        setupBehavior(level);

        return level;
      });
  };
}

// function createGrid(tiles, patterns) {
//   const grid = new Matrix();
//   for (const { tile, x, y } of expandTiles(tiles, patterns)) {
//     grid.set(x, y, tile);
//   }
//   return grid;
// }

function createGrid(tiles, patterns) {
  const grid = new Matrix();
  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, tile);
  }
  return grid;
}

function* expandSpan(xStart, xLen, yStart, yLen) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;
  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      yield { x, y };
    }
  }
}

function expandRange(range) {
  if (range.length === 4) {
    const [xStart, xLen, yStart, yLen] = range;
    return expandSpan(xStart, xLen, yStart, yLen);
  } else if (range.length === 2) {
    const [xStart, yStart] = range;
    return expandSpan(xStart, 1, yStart, 1);
  }
}

function* expandRanges(ranges) {
  for (const range of ranges) {
    for (const item of expandRange(range)) {
      yield item;
    }
  }
}

function expandTiles(tiles, patterns) {
  const expandedTiles = [];
  function walkTiles(tiles, offsetX, offsetY) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;
          walkTiles(tiles, derivedX, derivedY);
        } else {
          expandedTiles.push({
            tile,
            x: derivedX,
            y: derivedY,
          });
        }
      }
    }
  }
  walkTiles(tiles, 0, 0);
  return expandedTiles;
}

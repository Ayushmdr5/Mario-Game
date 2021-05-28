import Entity, { Characteristic } from "../Entity.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import KGwalk from "../characteristics/KGwalk.js";
import Killable from "../characteristics/Killable.js";
import Physics from "../characteristics/Physics.js";

class Behavior extends Characteristic {
  constructor() {
    super("behavior");
  }
  collides(us, them) {
    if (us.killable.dead) {
      return;
    }
    if (them.stomper && !them.powerup.isPowerup) {
      them.powerup.isPowerup = true;
      us.killable.kill();
      them.sounds.add('eatmushroom')

    }
  }
}

export function loadMushroom() {
  return loadSpriteSheet("mushroom").then(createMushroomFactory);
}

function createMushroomFactory(sprite) {
  function drawMushroom(context) {
    sprite.draw("mushroom", context, 0, 0);
  }

  return function createMushroom() {
    const mushroom = new Entity();
    mushroom.size.set(16, 14);
    // mushroom.vel.x = -20;

    mushroom.addCharacteristic(new Physics());
    mushroom.addCharacteristic(new KGwalk());
    mushroom.addCharacteristic(new Behavior());
    mushroom.addCharacteristic(new Killable());
    mushroom.killable.removeAfter = 0;
    mushroom.draw = drawMushroom;
    return mushroom;
  };
}

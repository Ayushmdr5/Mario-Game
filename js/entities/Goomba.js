import Entity, { Characteristic } from "../Entity.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import KGwalk from "../characteristics/KGwalk.js";
import Killable from "../characteristics/Killable.js";
import Physics from "../characteristics/Physics.js";

class Behavior extends Characteristic {
  constructor() {
    super("behavior");
    this.counter = 0
  }
  collides(us, them) {
    if (us.killable.dead) {
      return;
    }
    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        us.killable.kill();
        us.kgwalk.speed = 0;
      } else if (them.powerup.isPowerup) {
        us.killable.kill()
        us.kgwalk.speed = 0;
        them.sounds.add('powerdown')
        them.powerup.isPowerup = false;
        return;
      } else {
        them.killable.kill();
      }
    }
  }
}

export function loadGoomba() {
  return loadSpriteSheet("goomba").then(createGoombaFactory);
}

function createGoombaFactory(sprite) {
  const walkAnimation = sprite.animations.get("walk");

  function routeAnimation(goomba) {
    if (goomba.killable.dead) {
      return "flat";
    }
    return walkAnimation(goomba.lifeTime);
  }

  function drawGoomba(context) {
    sprite.draw(routeAnimation(this), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();
    goomba.size.set(16, 16);
    goomba.vel.x = -20;

    goomba.addCharacteristic(new Physics());
    goomba.addCharacteristic(new KGwalk());
    goomba.addCharacteristic(new Behavior());
    goomba.addCharacteristic(new Killable());
    goomba.draw = drawGoomba;
    return goomba;
  };
}

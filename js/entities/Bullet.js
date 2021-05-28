import Entity, { Characteristic } from "../Entity.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import Killable from "../characteristics/Killable.js";
import Physics from "../characteristics/Physics.js";
import Velocity from '../characteristics/Velocity.js'
import Gravity from '../characteristics/Gravity.js'

class Behavior extends Characteristic {
  constructor() {
    super("behavior");
    this.gravity = new Gravity()
  }
  collides(us, them) {
    if (us.killable.dead) {
      return;
    }
    if (them.stomper) {
      if (them.vel.y > us.vel.y + 25) {
        us.killable.kill();
        us.vel.set(100, -200)
      } 
      else if (them.powerup.isPowerup) {
        us.killable.kill();
        them.powerup.isPowerup = false;
        them.sounds.add('powerdown')
      }
      else {
        them.killable.kill();
      }
    }
  }
  update(entity, gameContext, level){
      if(entity.killable.dead){
          this.gravity.update(entity, gameContext, level)
      }
  }
}

export function loadBullet() {
  return loadSpriteSheet("bullet").then(createBulletFactory);
}

function createBulletFactory(sprite) {
  function drawBullet(context) {
    sprite.draw("bullet", context, 0, 0, this.vel.x < 0);
  }

  return function createBullet() {
    const bullet = new Entity();
    bullet.size.set(16, 14);

    bullet.addCharacteristic(new Velocity());
    bullet.addCharacteristic(new Behavior());
    bullet.addCharacteristic(new Killable());
    bullet.draw = drawBullet;
    return bullet;
  };
}

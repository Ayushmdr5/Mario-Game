import Entity, { Characteristic } from "../Entity.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import Killable from "../characteristics/Killable.js";
import KGwalk from "../characteristics/KGwalk.js";
import Physics from "../characteristics/Physics.js";

export function loadKoopa() {
  return loadSpriteSheet("koopa").then(createKoopaFactory);
}

const STATE_WALKING = "walking";
const STATE_HIDING = "hiding";
const STATE_PANIC = "panic";
const STATE_DEAD = "dead";

class Behavior extends Characteristic {
  constructor() {
    super("behavior");
    this.state = STATE_WALKING;
    this.hideTime = 0;
    this.hideDuration = 7;
    this.panicSpeed = 350;
  }
  collides(us, them) {
    if (us.killable.dead) {
      return;
    }
    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them);
      } else if (them.powerup.isPowerup) {
        us.killable.kill();
        us.kgwalk.speed = 0;
        this.state = STATE_DEAD;
        them.sounds.add("powerdown");
        them.powerup.isPowerup = false;
        return;
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      them.killable.kill();
    } else if (this.state === STATE_HIDING) {
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      them.killable.kill();
    }
  }
  handleStomp(us, them) {
    if (this.state == STATE_WALKING) {
      this.hide(us);
    } else if (this.state === STATE_HIDING) {
      us.kgwalk.speed = 210;
      us.vel.set(200, -200);
    } else if (this.state === STATE_PANIC) {
      this.hide(us);
    }
  }

  hide(us) {
    us.vel.x = 0;
    us.kgwalk.speed = 0;
    this.state = STATE_HIDING;
  }

  unhide(us) {
    us.kgwalk.speed = 40;
    this.hideTime = 0;
    this.state = STATE_WALKING;
  }

  panic(us, them) {
    us.kgwalk.speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = STATE_PANIC;
  }

  update(us, gameContext) {
    const deltaTime = gameContext.deltaTime;
    if (this.state === STATE_HIDING) {
      this.hideTime += deltaTime;
      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
      }
    }
  }
}

function createKoopaFactory(sprite) {
  const walkAnimation = sprite.animations.get("walk");
  const wakeAnimation = sprite.animations.get("wake");

  function routeAnimation(koopa) {
    if (koopa.behavior.state === STATE_HIDING) {
      if (koopa.behavior.hideTime > 4) {
        return wakeAnimation(koopa.behavior.hideTime);
      }
      return "hiding";
    } else if (
      koopa.behavior.state === STATE_PANIC ||
      koopa.behavior.state === STATE_DEAD
    ) {
      return "hiding";
    }
    return walkAnimation(koopa.lifeTime);
  }

  function drawKoopa(context) {
    sprite.draw(routeAnimation(this), context, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();
    koopa.size.set(16, 24);

    koopa.addCharacteristic(new Physics());
    koopa.addCharacteristic(new KGwalk());
    koopa.addCharacteristic(new Behavior());
    koopa.addCharacteristic(new Killable());
    koopa.draw = drawKoopa;
    return koopa;
  };
}

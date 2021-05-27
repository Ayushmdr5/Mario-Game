import { Characteristic } from "../Entity.js";

export default class Jump extends Characteristic {
  constructor() {
    super("jump");

    this.ready = false;
    this.duration = 0.3;
    this.velocity = 200;
    this.engageTime = 0;
  }

  start() {
    if (this.ready) {
      this.engageTime = this.duration;
    }
  }

  cancel() {
    this.engageTime = 0;
  }

  obstruct(entity, side) {
    if (side === "bottom") {
      this.ready = true;
    } else if (side === "top") {
      this.cancel();
    }
  }

  update(entity, {deltaTime}) {
    if (this.engageTime > 0) {
        entity.vel.y = -this.velocity;
        this.engageTime -= deltaTime;
    }
    if (this.ready && this.engageTime> 0){
      entity.sounds.add('jump')
    }
    this.ready = false;
  }
}

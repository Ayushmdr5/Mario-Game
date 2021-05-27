import { Characteristic } from "../Entity.js";

export default class Move extends Characteristic {
  constructor() {
    super("move");

    this.dir = 0;
    this.speed = 7000;
    this.distance = 0;
    this.heading = 1;
  }

  update(entity, gameContext) {
    const deltaTime = gameContext.deltaTime
    entity.vel.x = this.speed * this.dir * deltaTime;
    if (this.dir) {
      this.heading = this.dir
      this.distance += Math.abs(entity.vel.x) * deltaTime;
    } else {
      this.distance = 0;
    }
  }
}

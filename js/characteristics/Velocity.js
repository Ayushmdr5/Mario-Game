import { Characteristic } from "../Entity.js";

export default class Physics extends Characteristic {
  constructor() {
    super("velocity");
  }
  update(entity, {deltaTime}, level) {
    entity.pos.x += entity.vel.x * deltaTime;

    entity.pos.y += entity.vel.y * deltaTime;

    // console.log(entity, deltaTime, level)
  }
}

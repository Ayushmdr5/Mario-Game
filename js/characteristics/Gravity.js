import { Characteristic } from "../Entity.js";

export default class Gravity extends Characteristic {
  constructor() {
    super("gravity");
  }
  update(entity, { deltaTime }, level) {
    entity.vel.y += level.gravity * deltaTime;
  }
}

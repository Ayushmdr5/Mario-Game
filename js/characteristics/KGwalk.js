import { Characteristic } from "../Entity.js";

export default class KGwalk extends Characteristic {
  constructor() {
    super("kgwalk");
    this.speed = -30;
  }
  obstruct(entity, side) {
    if (side === "left" || side === "right") {
      this.speed = -this.speed;
    }
  }

  update(entity) {
    entity.vel.x = this.speed;
  }
}

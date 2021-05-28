import { Characteristic } from "../Entity.js";

export default class Trigger extends Characteristic {
  constructor() {
    super("trigger");
    this.touches = new Set
    this.conditions = []
  }

  collides(us, them) {
      this.touches.add(them)
  }

  update(entity, gameContext, level) {
      if(this.touches.size > 0){
          for (const condition of this.conditions){
              condition(entity, this.touches, gameContext, level)
          }
          this.touches.clear()
      }
  }
}

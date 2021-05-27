import { Characteristic } from "../Entity.js";

export default class Powerup extends Characteristic {
  constructor() {
    super("powerup");
    this.isPowerup = false;
  }

  update(entity, gameContext, level) {
    if(this.isPowerup){
        if(entity.player){
            entity.size.set(18, 32)
        }
    } else {
        if(entity.player){
            entity.size.set(16, 16)
        }
    }
  }
}

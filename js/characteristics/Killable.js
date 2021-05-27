import { Characteristic } from "../Entity.js";

export default class Killable extends Characteristic {
  constructor() {
    super("killable");
    this.dead = false;
    this.deadTime = 0;
    this.removeAfter = 2;
  }
  kill() {
    this.queue(() => (this.dead = true));
  }
  revive() {
    this.dead = false;
    this.deadTime = 0;
  }
  update(entity, { deltaTime }, level) {
    if (this.dead) {
      if (entity.player) {
        level.music.pause();
        if(this.deadTime === 0){
          entity.sounds.add('die')
        }
      }
      this.deadTime += deltaTime;
      if (this.deadTime > this.removeAfter) {
        if (entity.player) {
          entity.player.lives -= 1;
        }
        level.entites.delete(entity);
      }
    }
  }
}

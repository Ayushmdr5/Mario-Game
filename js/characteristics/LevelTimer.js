import { Characteristic } from "../Entity.js";

export default class LevelTimer extends Characteristic {
  constructor() {
    super("levelTimer");
    this.totalTime = 0;
    this.currentTime = this.totalTime
  }
  update(entity, { deltaTime }, level) {
    this.currentTime += deltaTime;
    level.events.emit('playtheme')
  }
}

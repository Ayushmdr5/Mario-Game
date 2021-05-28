import { Characteristic } from "../Entity.js";

export default class Player extends Characteristic {
  constructor() {
    super("player");
    this.coins = 0
    this.lives = 3;
    this.score = 0;

    this.listen('stomp', () => {
      this.score += 100
    })
  }

  incrementCoin(count, entity){
    this.coins += count;
    entity.sounds.add('coin')
  }
}

import { Characteristic } from "../Entity.js";
import { Vec2 } from "../math.js";

export default class PlayerController extends Characteristic {
  constructor() {
    super("playerController");
    this.player = null;
    this.checkpoint = new Vec2(0, 0);
    // this.score = 0;
    // this.time = 500;

  //   this.listen('stomp', () => {
  //     this.score += 100
  //   })
  }

  setPlayer(entity) {
    this.player = entity;
    // this.player.stomper.onStomp = () => {
    //   this.score += 100
    // }
    // console.log(this.player.stomper.events)
    // this.player.stomper.events.listen("stomp", () => {
    //   this.score += 100;
    // });
  }

  update(entity, { deltaTime }, level) {
    if (!level.entites.has(this.player)) {
        this.player.killable.revive();
        this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
        level.entites.add(this.player);
    } 
    // else {
    //   this.time -= deltaTime;
    // }
  }
}

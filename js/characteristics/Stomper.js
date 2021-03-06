import { Characteristic } from "../Entity.js";

export default class Stomper extends Characteristic {
  constructor() {
    super("stomper");
    this.queueBounce = false;
    this.bounceSpeed = 400;
  }
  bounce(us, them){
      us.bounds.bottom = them.bounds.top;
      us.vel.y = -this.bounceSpeed
  }

  collides(us, them){
    if (!them.killable || them.killable.dead){
      return
    }
    if(us.vel.y > them.vel.y){
      this.queue(() => this.bounce(us, them))
      us.sounds.add('stomp')
      us.events.emit('stomp', us, them)
    }
  }
}

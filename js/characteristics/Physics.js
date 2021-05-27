import { Characteristic } from "../Entity.js";

export default class Physics extends Characteristic {
  constructor() {
    super("physics");
  }
  update(entity, gameContext, level) {
    const { deltaTime } = gameContext;
    entity.pos.x += entity.vel.x * deltaTime;
    level.tileCollider.checkX(entity, gameContext, level);

    entity.pos.y += entity.vel.y * deltaTime;
    level.tileCollider.checkY(entity, gameContext, level);

    entity.vel.y += level.gravity * deltaTime;
    // console.log(entity, deltaTime, level)

    if (entity.player) {
      if (entity.player.lives === 0) {
        level.events.emit("restart");
        entity.player.lives = 3
        entity.player.score = 0
        entity.player.coins = 0
      }
    }
  }
}

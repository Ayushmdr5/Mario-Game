import Entity, { Characteristic } from "../Entity.js";
import Emitter from "../characteristics/Emitter.js";
import { loadAudioBoard } from "../loaders/audio.js";
import { findPlayers } from "../player.js";

const HOLD_FIRE = 10;

export const loadCannon = (audioContext) => {
  return loadAudioBoard("cannon", audioContext).then((audio) => {
    return createCannonFactory(audio);
  });
};

function createCannonFactory(audio) {
  let direction = 1;
  function emitBullet(cannon, gameContext, level) {
    for (const player of findPlayers(level)) {
      if (
        player.pos.x > cannon.pos.x - HOLD_FIRE &&
        player.pos.x < cannon.pos.x + HOLD_FIRE
      ) {
        return;
      }
      if (player.pos.x < cannon.pos.x) {
        direction = -1;
      } else if (player.pos.x > cannon.pos.x) {
        direction = 1;
      }
    }
    const bullet = gameContext.entityFactory.bullet();
    bullet.pos.set(cannon.pos.x, cannon.pos.y);
    bullet.vel.set(120 * direction, 0);
    cannon.sounds.add("shoot");
    level.entites.add(bullet);
  }

  return function createCannon() {
    const cannon = new Entity();
    cannon.audio = audio;

    const emitter = new Emitter();
    emitter.interval = 5;
    emitter.emitters.push(emitBullet);
    cannon.addCharacteristic(emitter);

    return cannon;
  };
}

import { loadGoomba } from "../js/entities/Goomba.js";
import { loadKoopa } from "../js/entities/Koopa.js";
import { loadMario } from "../js/entities/Mario.js";
import { loadBullet } from '../js/entities/Bullet.js'
import {loadCannon} from '../js/entities/Cannon.js'
import {loadMushroom} from '../js/entities/Mushroom.js'


export function loadEntities(audioContext) {
  const entities = {};
  return Promise.all([
    loadMario(audioContext).then((entity) => (entities["mario"] = entity)),
    loadGoomba(audioContext).then((entity) => (entities["goomba"] = entity)),
    loadKoopa(audioContext).then((entity) => (entities["koopa"] = entity)),
    loadBullet(audioContext).then((entity) => (entities["bullet"] = entity)),
    loadCannon(audioContext).then((entity) => (entities["cannon"] = entity)),
    loadMushroom(audioContext).then((entity) => (entities["mushroom"] = entity))

  ])
  .then(() => entities);
}

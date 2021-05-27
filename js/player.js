import Entity from "../js/Entity.js";
import Player from "../js/characteristics/Player.js";
import PlayerController from "../js/characteristics/PlayerController.js";

export function createPlayer(entity) {
  entity.addCharacteristic(new Player());
  return entity;
}

export function createPlayerEnv(playerEntity) {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(64, 64);
  playerControl.setPlayer(playerEntity);
  playerEnv.addCharacteristic(playerControl);

  return playerEnv;
}

export function* findPlayers(level) {
  for (const entity of level.entites) {
    // console.log('entiteis ', entity)
    if (entity.player) {
      yield entity;
    }
  }
}

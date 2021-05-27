import TileResolver from "../js/TileResolver.js";
import { mystery } from "../js/components/mystery.js";
import { ground } from "../js/components/ground.js";
import { coin } from "../js/components/coin.js";
import { mushroom } from "../js/components/mushroom.js";
import { brick } from "../js/components/brick.js";

const handlers = {
  mushroom: mushroom,
  mystery: mystery,
  ground: ground,
  coin: coin,
  brick: brick,
};

export default class TileCollider {
  constructor() {
    this.resolvers = [];
  }

  addGrid(tileMatrix) {
    this.resolvers.push(new TileResolver(tileMatrix));
  }

  checkX(entity, gameContext, level) {
    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        entity.bounds.left,
        entity.bounds.right,
        entity.bounds.top,
        entity.bounds.bottom
      ); // contains all tile property (eg [{name: 'ground'}, ..]) array corresponding to mario's all tile

      // console.log(this.handle)
      matches.forEach((match) => {
        this.handle(0, entity, match, resolver, gameContext, level);
      });
    }
  }

  checkY(entity, gameContext, level) {
    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        entity.bounds.left,
        entity.bounds.right,
        entity.bounds.top,
        entity.bounds.bottom
      ); // contains all tile property (eg [{name: 'ground'}, ..]) array corresponding to mario's all tile

      matches.forEach((match) => {
        // console.log(match.tile)
        this.handle(1, entity, match, resolver, gameContext, level);
      });
    }
  }
  test(entity, gameContext, level) {
    this.checkY(entity);
  }

  handle(index, entity, match, resolver, gameContext, level) {
    const tileCollisionContext = {
      entity,
      match,
      resolver,
      gameContext,
      level,
    };
    const handler = handlers[match.tile.type];
    // console.log(handler)
    if (handler) {
      handler[index](tileCollisionContext);
    }
  }
}

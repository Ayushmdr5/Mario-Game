function handleX({entity, match, resolver, gameContext, level}) {
    if (entity.vel.x > 0) {
      if (entity.bounds.right > match.x1) {
        entity.bounds.left = match.x1 - entity.size.x;
        entity.vel.x = 0;
        entity.obstruct("right");
      }
    }
    if (entity.vel.x < 0) {
      if (entity.bounds.left < match.x2) {
        entity.bounds.left = match.x2;
        entity.vel.x = 0;
        entity.obstruct("left");
      }
    }
  }
  
  function handleY({entity, match, resolver, gameContext, level}) {
    if (entity.vel.y > 0) {
      if (entity.bounds.bottom > match.y1) {
        entity.bounds.top = match.y1 - entity.size.y;
        entity.vel.y = 0;
        entity.obstruct("bottom");
      }
    }
    else if (entity.vel.y < 0) {
      entity.sounds.add('brickdestroy')
      const grid = resolver.matrix;
      grid.delete(match.indexX, match.indexY)
      if (entity.bounds.top < match.y2) {
        entity.bounds.top = match.y2;
        entity.vel.y = 0;
  
        entity.obstruct("top");
      }
    }
  }
  
  export const brick = [handleX, handleY]
  
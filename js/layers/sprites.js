// for mario
export const createSpriteLayer = (entities, width = 64, heigth = 64) => {
    const spriteBuffer = document.createElement("canvas");
    spriteBuffer.width = width;
    spriteBuffer.height = heigth;
    const spriteBufferContext = spriteBuffer.getContext("2d");
  
    return function drawSpriteLayer(context, display) {   // called in index (by compositor)
      entities.forEach((entity) => {
        spriteBufferContext.clearRect(0, 0, width, heigth);
        entity.draw(spriteBufferContext);
        context.drawImage(
          spriteBuffer,
          Math.floor(entity.pos.x - display.pos.x),
          Math.floor(entity.pos.y - display.pos.y)
        );
      });
    };
  };
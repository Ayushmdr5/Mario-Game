import { findPlayers } from "../player.js";

function getPlayer(level) {
  for (const entity of findPlayers(level)) {
    return entity;
  }
}

export function createWaitScreenLayer(font, level) {

    const spriteBuffer = document.createElement("canvas");
    spriteBuffer.width = 32;
    spriteBuffer.height = 32;
    const spriteBufferContext = spriteBuffer.getContext("2d");


  return function drawWaitScreen(context) {
    const mario = getPlayer(level);
    font.print("LEVEL " + level.name, context, 166, 85);
    font.print("X " + mario.player.lives.toString(), context, 190, 115);

    spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height)
    mario.draw(spriteBufferContext)
    context.drawImage(spriteBuffer, 162, 110)

  };
}

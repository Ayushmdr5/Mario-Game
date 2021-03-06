import TileResolver from '../TileResolver.js'

export const createBackgroundLayer = (level, tiles, sprites) => {
    const resolver = new TileResolver(tiles)
  
    const buffer = document.createElement("canvas");
    buffer.width = 386 + 16;
    buffer.height = 240;
  
    const context = buffer.getContext("2d");
  
    const redraw = (startIndex, endIndex) => {
      context.clearRect(0,0, buffer.width, buffer.height)

      for (let x = startIndex; x <= endIndex; x++) {
        const col = tiles.grid[x];
        if (col) {
          col.forEach((tile, y) => {
            if(sprites.animations.has(tile.name)){
              sprites.drawAnimation(tile.name, context, x -startIndex, y, level.totalTime)
            } else {
              sprites.drawTile(tile.name, context, x - startIndex, y);
            }
          });
        }
      }
    };

    return function drawBackgroundLayer(c, display) {
      const drawWidth = resolver.toIndex(display.size.x)
      const drawFrom = resolver.toIndex(display.pos.x)
      const drawTo = drawFrom + drawWidth
      redraw(drawFrom, drawTo)
  
      c.drawImage(buffer, Math.floor(-display.pos.x % 16), Math.floor(-display.pos.y));
    };
  };
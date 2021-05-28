import {findPlayers} from '../player.js'

function getPlayerCharacteristic(level){
  for (const entity of findPlayers(level)){
    return entity.player
  }
}

function getTimerCharacteristic(level){
  for (const entity of level.entites){
    if(entity.levelTimer){
      return entity.levelTimer
    }
  }
}

export function createDashboardLayer(font, level) {
    const LINE1 = font.size;
    const LINE2 = font.size * 2 + 1;
    
    const timerCharacteristic = getTimerCharacteristic(level)
    return function drawDashboard(context) {
    const playerCharacteristic = getPlayerCharacteristic(level)

    if (playerCharacteristic){
      font.print('SCORE', context, 15, LINE1)
      font.print(playerCharacteristic.score.toString().padStart(5, '0'), context, 15, LINE2)
      
      font.print('COINS', context, 92, LINE1)
      font.print(playerCharacteristic.coins.toString().padStart(4, '0'), context, 92, LINE2)
  
      font.print('LEVEL', context, 172, LINE1)
      font.print(level.name, context, 185, LINE2)
  
      font.print('TIME', context, 245, LINE1)
      font.print(timerCharacteristic.currentTime.toFixed().padStart(4, '0'), context, 245, LINE2)
  
      font.print('LIVES', context, 318, LINE1)
      font.print(playerCharacteristic.lives.toString(), context, 330, LINE2)
    }
  };
}

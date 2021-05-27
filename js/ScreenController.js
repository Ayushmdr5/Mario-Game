
import Screen from '../js/Screen.js'

export default class ScreenController extends Screen {
  constructor() {
    super()
    this.timer = 2
  }

  update(gameContext) {
      this.timer -= gameContext.deltaTime;
      if (this.timer <= 0){
          this.events.emit('complete')
      }
  }
}

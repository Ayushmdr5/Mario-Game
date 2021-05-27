export default class DisplayChanger {
  constructor() {
    this.displayIndex = -1;
    this.displays = [];
  }

  addDisplay(display) {
    display.events.listen("complete", () => {
      this.runNext();
    });
    this.displays.push(display);
  }

  runNext() {
      const currentDisplay = this.displays[this.displayIndex]
      if(currentDisplay){
          currentDisplay.pause()
      }
    this.displayIndex++;
  }
  
  // restart(){
  //   const currentDisplay = this.displays[0]
  //     if(currentDisplay){
  //         currentDisplay.pause()
  //     }
  //   this.displayIndex++;
  // }

  update(gameContext) {
    // if(mario.player.lives === 2){
    //   this.restart()
    // }
    const currentDisplay = this.displays[this.displayIndex];
    if (currentDisplay) {
      currentDisplay.update(gameContext);
      currentDisplay.draw(gameContext);
    }
  }
}

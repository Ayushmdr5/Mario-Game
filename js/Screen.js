import Compositor from "../js/Compositor.js";
import EventEmitter from "../js/EventEmitter.js";

export default class Screen {
  constructor() {
    this.events = new EventEmitter();
    this.comp = new Compositor(); 
  }

  draw(gameContext){
    this.comp.draw(gameContext.videoContext)
  }

  update(gameContext) {

  }
  pause(){
      
  }
}

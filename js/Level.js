import Compositor from "../js/Compositor.js";
import Display from "../js/display.js";
import TileCollider from "../js/TileCollider.js";
import EntityCollider from "../js/EntityCollider.js";
import MusicController from "../js/MusicController.js";
import EventEmitter from "../js/EventEmitter.js";
import FallCheck from '../js/FallCheck.js'
import Screen from '../js/Screen.js'
import { findPlayers } from "./player.js";

function focusPlayer(level) {
  for (const player of findPlayers(level)) {
    level.display.pos.x = Math.max(0, player.pos.x - 130);
  }
}

export default class Level extends Screen{
  constructor() {
    super();
    this.name = ""
    this.gravity = 1500;
    this.totalTime = 0;
    this.display = new Display();
    this.music = new MusicController();
    this.entites = new Set(); 
    this.tileCollider = new TileCollider();
    this.EntityCollider = new EntityCollider(this.entites);
    this.FallCheck = new FallCheck(this.entites)
  }

  draw(gameContext){
    this.comp.draw(gameContext.videoContext, this.display)
  }

  update(gameContext) {
    this.entites.forEach((entity) => {
      entity.update(gameContext, this);
    });

    this.entites.forEach((entity) => {
      this.EntityCollider.check(entity);
      this.FallCheck.check()
    });

    this.entites.forEach((entity) => {
      entity.finalize();
    });

    focusPlayer(this)

    this.totalTime += gameContext.deltaTime;
  }

  pause(){
    this.music.pause()
  }
}

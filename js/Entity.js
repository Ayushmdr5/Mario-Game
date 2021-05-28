import { Vec2 } from "../js/math.js";
import BoundingBox from "../js/BoundingBox.js";
import { AudioBoard } from "../js/AudioBoard.js";
import EventEmitter from "../js/EventEmitter.js";
import EventBuffer from '../js/EventBuffer.js'

export class Characteristic {
  constructor(name) {
    this.NAME = name;
    this.tasks = [];
    this.listeners = [];
  }
  listen(name, callback) {
    const listener = { name, callback };
    this.listeners.push(listener);
  }

  obstruct() {}

  queue(task) {
    this.tasks.push(task);
  }

  finalize(entity) {
    for (const listener of this.listeners){
      entity.events.process(listener.name, listener.callback)
    }
    this.tasks.forEach((task) => task());
    this.tasks.length = 0;
  }

  collides(us, them) {}

  update() {}
}

export default class Entity {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
    this.size = new Vec2(0, 0);
    this.offset = new Vec2(0, 0);
    this.events = new EventBuffer();
    this.bounds = new BoundingBox(this.pos, this.size, this.offset);
    this.lifeTime = 0;
    this.audio = new AudioBoard();
    this.sounds = new Set();
    this.charateristics = [];
  }

  addCharacteristic(charateristic) {
    this.charateristics.push(charateristic);
    this[charateristic.NAME] = charateristic;
  }

  collides(candidate) {
    this.charateristics.forEach((charateristic) => {
      charateristic.collides(this, candidate);
    });
  }

  draw() {}

  finalize() {
    this.charateristics.forEach((charateristic) => {
      charateristic.finalize(this);
    });
    this.events.clear()
  }

  obstruct(side) {
    this.charateristics.forEach((charateristic) => {
      charateristic.obstruct(this, side);
    });
  }

  playSounds(audioBoard, audioContext) {
    this.sounds.forEach((name) => {
      audioBoard.playAudio(name, audioContext);
    });
    this.sounds.clear();
  }

  update(gameContext, level) {
    this.charateristics.forEach((charateristic) => {
      charateristic.update(this, gameContext, level);
    });
    this.playSounds(this.audio, gameContext.audioContext);

    this.lifeTime += gameContext.deltaTime;

  }
}

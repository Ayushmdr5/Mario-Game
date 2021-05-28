import Entity, { Characteristic } from "../Entity.js";
import Move from "../characteristics/Move.js";
import Jump from "../characteristics/Jump.js";
import Stomper from '../characteristics/Stomper.js'
import { loadSpriteSheet } from "../loaders/sprite.js";
import Killable from "../characteristics/Killable.js";
import Physics from '../characteristics/Physics.js'
import { loadAudioBoard } from "../loaders/audio.js";
import Powerup from '../characteristics/Powerup.js'


export const loadMario = (audioContext) => {

  return Promise.all([loadSpriteSheet("mario"), 
  loadAudioBoard('mario', audioContext)])
  .then(([sprite, audio]) => {
    return createMarioFactory(sprite, audio)
  })
};

function createMarioFactory(sprite, audio) {
  const runAnimation = sprite.animations.get('run')
  const bigRunAnimation = sprite.animations.get('run-big')
  const routeFrame = (mario) => {
    
    if(mario.killable.dead){
      return 'dead'
    }
    if (!mario.jump.ready) {
      if(mario.powerup.isPowerup){
        return "jump-big"
      }
      return "jump";
    }
    if (mario.move.dir !== 0) {
      if(mario.powerup.isPowerup){
        return bigRunAnimation(mario.move.distance)
      } else {
        return runAnimation(mario.move.distance);
      }
    }
    if(mario.powerup.isPowerup){
      return 'idle-big'
    }
    return "idle";
  };
  return function createMario() {
    const mario = new Entity();
    mario.audio = audio
    mario.size.set(14, 16);

    mario.addCharacteristic(new Move());
    mario.addCharacteristic(new Jump());
    mario.addCharacteristic(new Stomper())
    mario.addCharacteristic(new Killable())
    mario.addCharacteristic(new Physics())
    mario.addCharacteristic(new Powerup())
    // mario.addCharacteristic(new Fall(mario))
    
    mario.killable.removeAfter = 2.5

    mario.draw = function drawMario(context) {
      sprite.draw(routeFrame(this), context, 0, 0, mario.move.heading < 0);
    };

    return mario;
  };
}

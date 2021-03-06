import { loadJSON } from "../loader.js";
import {AudioBoard} from '../AudioBoard.js'

export function loadAudioBoard(name, audioContext) {
  const loadAudio = createAudioLoader(audioContext);
  return loadJSON(`audiosource/sounds/${name}.json`)
  .then(audioSheet => {
      const audioBoard = new AudioBoard(audioContext);
      const audio = audioSheet.audio
      const jobs = []
      Object.keys(audio).forEach(name => {
          const url = audio[name].url
          const job = loadAudio(url).then(buffer => {
              audioBoard.addAudio(name, buffer)
          })
          jobs.push(job)
      })
      return Promise.all(jobs).then(() => audioBoard)
  })
}

export function createAudioLoader(context) {
  return function loadAudio(url) {
    return fetch(url)
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        return context.decodeAudioData(arrayBuffer);
      });
  };
}

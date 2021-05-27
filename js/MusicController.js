export default class MusicController {
    constructor(){
        this.player = null
    }
    setPlayer(player) {
        this.player = player;
    }
    pause(){
        this.player.pauseAll()
    }
}

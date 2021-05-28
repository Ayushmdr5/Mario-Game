
export default class FallCheck{
    constructor(entities){
        this.entities = entities
    }

    check(){
        this.entities.forEach(candidate => {
            if(candidate.player){
                if(candidate.pos.y > 300){
                    candidate.killable.kill()
                }
            }

        })
    }
}
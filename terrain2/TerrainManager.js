const W = 256
const H = 768
const OFFSET = 256
const INCRE = 1
class TM {
    constructor() {
    	this._z = 0
    	this._passes = 0
    }

    get z(){
    	return this._z
    }

    set z(v){
    	this._z = v
    }

    get worldZ(){
    	return H * this._passes + this._z
    }

    get worldZMin(){
    	return H * this._passes
    }

    get worldZMax(){
    	return H * this._passes + H
    }

    update() {
        this._z += INCRE

        if (this._z > 256) {
            this._z = -512
            this._passes++
        }
    }
}

const _TM = new TM()

export default _TM
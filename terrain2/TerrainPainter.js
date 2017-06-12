const W = 256
const H = 768
const OFFSET = 256
const BLEND = 20
const VERBOSE = false
import { getAsset } from '../rad/Utils'
class TM {
    constructor(assetId) {
        this._assetId = assetId

        this._source = document.createElement('canvas')
        this._sctx = this._source.getContext('2d')
        this._source.width = W
        this._source.height = H


        this._canvas = document.createElement('canvas')
        this._ctx = this._canvas.getContext('2d')
        this._canvas.width = W
        this._canvas.height = H + OFFSET
        this._offset = [0, 0]

        if (VERBOSE) {
            this._canvas.style.position = 'absolute'
            this._canvas.style.transformOrigin = '50% 5%'
            this._canvas.style.transform = 'scale(0.5)'
            document.body.appendChild(this._canvas)
        }

        this._y = 0
        this._idIndex = 0
        this._sampleY = 0 //H / 2 + 
        this._placeY = H + OFFSET

        this._goingDown = true

        if (this._assetId) {
            this.init(this._assetId)
        }
    }

    setTerrains(ids) {
        this._ids = ids
        this._draw(this._ids[this._idIndex])
        //this._drawSource(this._ids[this._idIndex])
        //this._drawCanvas(this._ids[this._idIndex])
    }

    getNextTerrainId() {
        let _i = this._idIndex + 1
        if (_i > this._ids.length - 1) {
            _i = 0
        }
        return this._ids[_i]
    }

    _completed() {
        this._idIndex++
            if (this._idIndex > this._ids.length - 1) {
                this._idIndex = 0
            }
            //this._drawSource(this._ids[this._idIndex])
            //this._drawCanvas(this._ids[this._idIndex])
    }

    _draw(id){
    	this._drawSource(id)
        this._drawCanvas(id)
    }

    _drawSource(id) {
        this._sctx.drawImage(getAsset(id), 0, OFFSET);
        let _nextId = this.getNextTerrainId()
        this._sctx.drawImage(getAsset(_nextId), 0, H - OFFSET, W, OFFSET, 0, 0, W, OFFSET);
        //this._blendWithNext(this._sctx)
    }

    _drawCanvas(id) {
        /*let _data =this._getMap(0,0,W, H+OFFSET)
        this._ctx.putImageData(_data, 0, 0)
        this._ctx.drawImage(this._source,0,0);*/
        
        this._ctx.drawImage(getAsset(id),0,OFFSET);
        let _nextId = this.getNextTerrainId()
        this._ctx.drawImage(getAsset(_nextId), 0, H - OFFSET, W, OFFSET, 0, 0, W, OFFSET);
    }

    _blendWithNext(ctx) {
        let _data = ctx.getImageData(0, 0, W, H + OFFSET)
        let _nextTerrainStart = 4 * W * (OFFSET-BLEND)
        let _terrainStart = 4 * W * (OFFSET+BLEND)
        let _total = 4 * W * BLEND
        let pixels = _total;
        let _weight;
        while (pixels--) {
            let _weight = pixels / _total
            let _nextTerrainPixel = Math.floor(_data.data[_nextTerrainStart + pixels] )
            let _terrainPixel = Math.floor(_data.data[_terrainStart - pixels] * (_weight))
            _data.data[_terrainStart - pixels] =   _nextTerrainPixel
        }
        for (var i = 0; i < _data.data.length; i++) {
            //_data.data[i] =  0//_terrainPixel
        }
        ctx.putImageData(_data, 0,0)
    }

    init(id) {
        this._drawSource(id)
    }

    _getMap(x = 0, y = 0, w = 256, h = 256) {
        return this._sctx.getImageData(x, y, w, h)
    }

    get offset() {
        return this._offset
    }
    set offset(val = [0, 0]) {
        this._offset = val
    }
    get canvas() {
        return this._canvas
    }

    update(incre = 1) {
        let _sIncre = incre
        if (this._countingUp) {
            _sIncre *= -1
        }
        this._sampleY += _sIncre
        this._placeY -= incre
        let y = 0

        if (this._sampleY <= 0 || this._sampleY >= H) {
            this._countingUp = !this._countingUp
        }

        if (this._placeY < OFFSET) {
            this._placeY = H + OFFSET
            this._completed()
        }

        let _offset = this._placeY - (H)
        let _d = this._getMap(0, this._sampleY, W, 1)
        if (_offset > 0) {
            this._ctx.putImageData(_d, 0, _offset)
        }

        this._ctx.putImageData(_d, 0, this._placeY)
    }
}

export default TM
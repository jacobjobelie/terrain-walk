// GroundView.js

import alfrid from '../lib/alfrid';
import lodash from 'lodash';
import TerrainManager from './TerrainManager';
import TerrainPainter from './TerrainPainter';
import { getAsset } from '../rad/Utils'
let GL = alfrid.GL;

import vs from "./ground_vert"
import fs from "./ground_frag"

//import NOISE from './tools/noise';
const PARAMS = {
    offset: 0
}
const AMP = 30
const W = 256
const H = 256
const SEG = 128
const scale = 5

//let LIGHT = [237, 218, 236]
let LIGHT = [103, 50, 57]
    //const LIGHT = [168, 138, 110]
let DARK = [109, 64, 57]
let BASE = [168, 127, 83]
let FOG = [155, 134, 144]



class GroundView extends alfrid.View {

    constructor(params = {}) {
        super(vs, fs);
        this._texures = []
        this._texuresLength = 0
        this.baseColor = BASE
        this.rotation = Math.PI / 2
        this.scale = params.scale || scale
        this._wsegments = params.widthSegments || SEG
        this._hsegments = params.heightSegments || SEG
        this._w = params.width || W
        this._h = params.height || H
        this._amp = params.amp || AMP
        this.x = 0
        this.y = 0
        this.z = 0
        this._initMesh()
        this._initPosition(params.position || [0, -4, 0])

        this._pBase = BASE
        this._pLight = LIGHT
        this._pDark = DARK
        this._pFog = FOG

        this._createCanvas()

        this._terrainHeight = new TerrainPainter()
        this._terrainAo = new TerrainPainter()
        this._terrainHeight.setTerrains(['heightmap1', 'heightmap2'])
        this._terrainAo.setTerrains(['ao1', 'ao2'])

        this._heightTexture = new alfrid.GLTexture(this._terrainHeight.canvas);
        this._aoTexture = new alfrid.GLTexture(this._terrainAo.canvas);
        //this._updateMap()
    }

    _initPosition(pos) {
        this.x = pos[0]
        this.y = pos[1]
        this.z = pos[2]
    }

    _createCanvas() {
        this._canvas = document.createElement('canvas')
        this._ctx = this._canvas.getContext('2d')
        this._canvas.width = W
        this._canvas.height = H
    }

    _drawAsset(id) {
        var _c = document.createElement('canvas')
        this._ctx = _c.getContext('2d')
        _c.width = this._w
        _c.height = this._h
        this._ctx.drawImage(getAsset(id), 0, 0);
    }

    _drawMapData(data, x = 0, y = 0) {}

    _updateMap(x = 0, y = 0) {
        let _data = TerrainManager.getMap()
        this._ctx.putImageData(_data, x, y)
        this._heightTexture.updateTexture(this._canvas)
    }

    createFromAssetId(id) {
        //this._drawMapData(TerrainManager.getMap())
        //this._drawAsset(id)
    }

    pixelValueAt(x, y) {
        x = Math.round(x) + this._w / 2
        y = Math.round(y) + this._h / 2
        var imgd = this._ctx.getImageData(x, y, 1, 1);
        var pix = imgd.data;
        return pix[0] / 255 * this._amp
    }

    _init() {

    }

    _initMesh() {
        this.mesh = alfrid.Geom.plane(this._w, this._h, this._wsegments, this._hsegments);
    }


    render(ao, height) {
        //console.log(this.z);
        this.z += 1.
        this._terrainHeight.update(1)
        this._terrainAo.update(1)

        if (this.z > 256){
            this.z = -512
        }
            //this._updateMap()
        this._heightTexture.updateTexture(this._terrainHeight.canvas)
        this._aoTexture.updateTexture(this._terrainAo.canvas)
        this.shader.bind();
        this.shader.uniform("uAoMap", "uniform1i", 0);
        this.shader.uniform("uHeightMap", "uniform1i", 1);
        this._aoTexture.bind(0);
        this._heightTexture.bind(1);

        let baseColor = [this._pBase[0] / 255, this._pBase[1] / 255, this._pBase[2] / 255];
        let baseDark = [this._pDark[0] / 255, this._pDark[1] / 255, this._pDark[2] / 255];
        let baseLight = [this._pLight[0] / 255, this._pLight[1] / 255, this._pLight[2] / 255];
        let fog = [this._pFog[0] / 255, this._pFog[1] / 255, this._pFog[2] / 255];

        this.shader.uniform("baseColor", "vec3", baseColor);
        this.shader.uniform("lightColor", "vec3", baseLight);
        this.shader.uniform("darkColor", "vec3", baseDark);
        this.shader.uniform("fogColor", "vec3", fog);
        this.shader.uniform("position", "vec3", [this.x, this.y, TerrainManager.z]);
        this.shader.uniform("scale", "vec3", [this.scale, this.scale, this.scale]);
        this.shader.uniform("rotation", "float", this.rotation);
        this.shader.uniform("heightMap", "float", this._amp);
        GL.draw(this.mesh);
    }


}

export default GroundView;
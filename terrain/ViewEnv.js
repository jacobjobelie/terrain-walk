// ViewEnv.js

import alfrid from '../lib/alfrid';
let GL = alfrid.GL;

import GroundView from "../terrain2/GroundView"
import SkyView from "./ViewSky"
import MountainView from "./MountainView"

class ViewEnv {

    constructor(param = {}) {
        this.param = param
        this._initTextures()
        this._initMesh()
    }

    _initTextures() {

        function getAsset(id) {
            for (var i = 0; i < assets.length; i++) {
                if (id === assets[i].id) {
                    return assets[i].file;
                }
            }
        }
        // this._textureDiffuse = new alfrid.GLTexture(getAsset('diffuse'));
        // this._textureHeight = new alfrid.GLTexture(getAsset('height'));
        // this._textureAo = new alfrid.GLTexture(getAsset('ao'));
        // this._textureAlbedo = new alfrid.GLTexture(getAsset('albedo'));

        this._tHorizon = new alfrid.GLTexture(getAsset('horizon'));

        this._tW = new alfrid.GLTexture(getAsset('whole_map_height'));
        this._tWao = new alfrid.GLTexture(getAsset('ao1'));

        // this._tAo = new alfrid.GLTexture(getAsset('river_ao'));
        // this._tHeight = new alfrid.GLTexture(getAsset('heightmap'));

        // this._tMTop = new alfrid.GLTexture(getAsset('mountain_top'));
        // this._tMLeft = new alfrid.GLTexture(getAsset('mountain_left'));
        // this._tMRight = new alfrid.GLTexture(getAsset('mountain_right'));

        // this._tMTopAo = new alfrid.GLTexture(getAsset('mountain_top_ao'));
        // this._tMLeftAo = new alfrid.GLTexture(getAsset('mountain_left_ao'));
        // this._tMRightAo = new alfrid.GLTexture(getAsset('mountain_right_ao'));


    }


    _initMesh() {
        this._sky = new SkyView(this.param.sky)
        this._terrain = new GroundView(this.param.ground)
        // this._terrainLeft = new GroundView(Object.assign({},
        //     this.param.ground, {
        //         position: [-256, -40, 0],
        //         widthSegments: 8,
        //         heightSegments: 32,
        //     }))
        // this._terrainRight = new GroundView(Object.assign({},
        //         this.param.ground, {
        //             position: [256, -40, 0],
        //             widthSegments: 32,
        //             heightSegments: 128,
        //         }))
            // this._mountain1 = new MountainView(this.param.mountains[0])
            // this._mountain2 = new MountainView(this.param.mountains[1])
            // this._mountain3 = new MountainView(this.param.mountains[2])
    }


    render() {
        GL.disable(GL.CULL_FACE);
        //this._sky.render(this._tHorizon)
        GL.enable(GL.CULL_FACE);
        this._terrain.render(this._tWao, this._tW)
        //this._terrainLeft.render(this._tWao, this._tW)
        //this._terrainRight.render(this._tWao, this._tW)
            // this._mountain1.render(this._tMTop, this._tMTopAo)
            // this._mountain2.render(this._tMLeft, this._tMLeftAo)
            // this._mountain3.render(this._tMRight, this._tMRightAo)
    }


}

export default ViewEnv;
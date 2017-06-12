// ViewEnv.js

import alfrid, {Mesh} from '../lib/alfrid';

let GL = alfrid.GL;

import vs from "./model_vert"
import fs from "./basic_frag"

import TerrainManager from '../terrain2/TerrainManager';

class ViewEnv extends alfrid.View {

    constructor(params= {}) {
        super(vs, fs);

        this._initPosition(params.position || [0, 0, 0])
    }

    _initPosition(pos) {
        this.x = pos[0]
        this.y = pos[1]
        this.z = pos[2]
    }


    _init() {
        this.mesh = alfrid.Geom.cube(30,30,30, true);
    }


    render(texture, textureHeight, textureAo, textureAlbedo) {
        this.shader.bind();
        this.shader.uniform("position", "vec3", [this.x, this.y, TerrainManager.z - 256]);
        GL.draw(this.mesh);
    }


}

export default ViewEnv;
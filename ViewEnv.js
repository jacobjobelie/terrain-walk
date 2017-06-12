// ViewEnv.js

import alfrid, {Mesh} from './lib/alfrid';

let GL = alfrid.GL;

import vs from "./shaders/basic_vert"
import fs from "./shaders/env_frag"

class ViewEnv extends alfrid.View {

    constructor() {
        super(vs, fs);
    }


    _init() {
        this.mesh = alfrid.Geom.sphere(30, 116, true, false);
    }


    render(texture, textureHeight, textureAo, textureAlbedo) {
        this.shader.bind();
        this.shader.uniform("texture", "uniform1i", 0);
        this.shader.uniform("textureHeight", "uniform1i", 1);
        this.shader.uniform("uAoMap", "uniform1i", 2);
        this.shader.uniform("uAlbedo", "uniform1i", 3);

        this.shader.uniform("uAoStrength", "uniform1f", params.ao);
        this.shader.uniform("uExposure", "uniform1f", params.exposure);
        this.shader.uniform("displace", "float", params.displace);
        this.shader.uniform("uSaturation", "float", params.saturation);
        this.shader.uniform("uGamma", "uniform1f", params.gamma);

        texture.bind(0);
        textureHeight.bind(1);
        textureAo.bind(2);
        textureAlbedo.bind(3);
        GL.draw(this.mesh);
    }


}

export default ViewEnv;
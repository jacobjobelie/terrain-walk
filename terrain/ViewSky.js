// ViewEnv.js

import alfrid from '../lib/alfrid';
let GL = alfrid.GL;

import vs from "./basic_vert"
import fs from "./sky_frag"

class ViewSky extends alfrid.View {
	
	constructor(param = {}) {
		super(vs, fs);
		this._r = param.radius || 500
		this._seg = param.segments || 24
		this._initMesh()
	}


	_initMesh() {
		this.mesh = alfrid.Geom.sphere(this._r, this._seg, false, false);
	}


	render(tHorizon) {
		this.shader.bind();
		this.shader.uniform("uHorizon", "uniform1i", 0);
		tHorizon.bind(0)
		GL.draw(this.mesh);
	}


}

export default ViewSky;
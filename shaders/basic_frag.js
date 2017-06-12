const F = `

precision highp float;
varying vec3        vNormal;
varying vec3        vPosition;
varying vec3		vEyePosition;
varying vec3		vWsNormal;
varying vec3		vWsPosition;
varying vec2 		vTextureCoord;

varying vec3 vLightRay;
varying vec3 vEyeVec;

void main(void) {
    gl_FragColor = vec4(vec3(1.0, 1.0, 0.) ,1.0);
}

`

export default F
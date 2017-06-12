const F = `

// basic.vert
#define AMP 2.

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform vec3 position;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
	vec3 pos = aVertexPosition;
	pos += position;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}

`

export default F
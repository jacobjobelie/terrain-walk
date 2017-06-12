const F = `

// basic.vert
#define AMP 2.

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform sampler2D texture;
uniform sampler2D textureHeight;

uniform float displace;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

//blue is lowest
//green is mid
//red is mid

// but all three together is taller...

void main(void) {
	vec3 pos = aVertexPosition;

	//float amp = 0.;
	float amp = displace;

	vec3 color = texture2D(textureHeight, aTextureCoord).rgb;
	
	amp -= (1. - color.r) * displace;
	
	pos += aNormal * amp;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}

`

export default F
const F = `

// basic.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
uniform sampler2D uHorizon;
varying vec2 vTextureCoord;

void main(void) {
	vec4 color = texture2D(uHorizon, vTextureCoord);
    gl_FragColor = vec4(color.rgb,1.0);
}

`

export default F
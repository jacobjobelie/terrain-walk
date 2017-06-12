import {
    EnvBRDFApprox,
    FixCubeLookup,
    Uncharted2Tonemap,
    correctGamma,
    COLOR0,
    COLOR1,
} from './pbr'

import {
    changeContrast,
} from './color'

import Blend from './blend'
import {applyFog} from './fog'

console.log(changeContrast);


const F = `

#extension GL_EXT_shader_texture_lod : enable
#define EXPOSURE 4.6
#define GAMMA 1.
#define GAMMA 1.
#define FOG 0.2


precision highp float;

uniform float rotation;
uniform sampler2D 	uHeightMap;
uniform sampler2D 	uAo;

uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;

uniform vec3 baseColor;
uniform vec3 lightColor;
uniform vec3 darkColor;
uniform vec3 fogColor;

varying vec3        vNormal;
varying vec3        vPosition;
varying vec3		vEyePosition;
varying vec3		vWsNormal;
varying vec3		vWsPosition;
varying vec2 		vTextureCoord;

varying vec3 vLightRay;
varying vec3 vEyeVec;


// Filmic tonemapping from
// http://filmicgames.com/archives/75

const float A = 0.15;
const float B = 0.50;
const float C = 0.10;
const float D = 0.20;
const float E = 0.02;
const float F = 0.30;



${Uncharted2Tonemap}
${EnvBRDFApprox}
${FixCubeLookup}
${correctGamma}
${COLOR0}
${COLOR1}

${changeContrast}

${applyFog}

${Blend}

void main() {
	vec2 st = vTextureCoord;

	vec4 dv = texture2D( uHeightMap, vTextureCoord );
	vec4 ao = texture2D( uAo, vTextureCoord );

	vec3 color = baseColor;

	vec3 L = normalize(vLightRay);
	vec3 N = normalize(vNormal);
	vec3 wN = normalize( vWsNormal );
	float lambertTerm = max(dot(N,-L),0.33);

	float ssao 			= smoothstep(0.04, 1.0, ao.r);
	color 				*= ssao;

	vec3 cAo = changeContrast(ao.rgb, 2.0);
	vec3 gradientMap = mix(lightColor, darkColor, cAo.r) * 0.5;

	vec3 nColor = blendAverage_19_18(color, gradientMap);

	vec3 _l =  normalize(vWsPosition) - normalize(vEyePosition);
	vec3 finalColor =  applyFog(nColor, fogColor, length(_l), FOG);

	gl_FragColor = vec4(finalColor, 1.0);
}

`


// float depth = rgbaDepth.r;
// float visibility = (shadowCoord.z > depth + 0.005) ? 0.7:1.0;
// 46 ' gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);\n' +

export default F
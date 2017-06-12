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

import { applyFog } from './fog'

import {
    sunSkyPosition,
    SUN_MORNING,
    SUN_EVENING,
    mixMorningEvening
} from './sun'

const F = `

#extension GL_EXT_shader_texture_lod : enable
#define EXPOSURE 4.6
#define GAMMA 1.
#define GAMMA 1.
#define FOG 0.8
#define NEAR 0.
#define FAR 512.


precision highp float;

uniform float rotation;
uniform sampler2D 	uHeightMap;
uniform sampler2D 	uAoMap;

uniform vec3 uLightPosition;
uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;

uniform vec3 baseColor;
uniform vec3 lightColor;
uniform vec3 darkColor;
uniform vec3 fogColor;
uniform vec3 position;

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
	//vec3 shadowCoord =(v_PositionFromLight.xyz/v_PositionFromLight.w) / 2.0 + 0.5; 
	//gl_FragColor = vec4(vTextureCoord, sin(rotation) * .5 + .5, 1.0);
	vec2 st = vTextureCoord;

	vec4 dv = texture2D( uHeightMap, vTextureCoord );
	vec3 L = normalize(vec3(-12, -20, 3));
	vec3 N = normalize(vNormal);
	vec3 normal = normalize(vNormal * 2.0 - 1.0);
	vec3 wN 				= normalize( vWsNormal );
	float lambertTerm = max(dot(N,-L),0.33);

	//vec3 E = normalize(vEyePosition);
	//vec3 P = normalize(vPosition);

	vec3 color = baseColor;//uLightDiffuse.rgb;
	// bottom-left
	vec2 bl = smoothstep(vec2(0.),vec2(st), vec2(0.6)); 
    float pct = bl.x * bl.y;

    // top-right 
    vec2 tr = smoothstep(vec2(0.),vec2(1.0-st), vec2(0.6));
    pct *= tr.x * tr.y;

	color *= pct;
	
	vec3 ao 			= texture2D(uAoMap, vTextureCoord).rgb;
	float ssao 			= smoothstep(0.04, 1.0, ao.r);
	color 				*= ssao;

	vec3 cAo = changeContrast(ao, 2.0);
	vec3 gradientMap = mix(lightColor, darkColor, cAo.r) * 0.5;

	vec3 nColor = blendAverage_19_18(color, gradientMap);

	float lightWeight = max(dot(normal, -normalize(L)), 0.);

	float _near = NEAR + position.z;
	float _far = FAR + position.z;
	float linearDepth = clamp(length(vPosition) / (_far - _near), 0., .8);
	nColor *= lightWeight;

	//color *= 0.5;
	//color += grad;

	//color = mix(color, grad, ao.r);

	//vec3 contrasted = changeContrast(vec3(1.,0.3,0.4), 4.)
	//vec3 nColor = mix(color, grad, texel.r);
	
	//color *= grad; 

	//vec4 Id = color * dv;// * lambertTerm; 
	//ao *= lambertTerm;

	//vec3 rgbaDepth  = texture2D( uShadowmap, vTextureCoord ).xyz;
	//float visibility = (shadowCoord.z > depth + 0.005) ? 0.7:1.0;
	//Id;

	// apply the tone-mapping
	nColor				= Uncharted2Tonemap( nColor * EXPOSURE );
	// white balance
	nColor				= nColor * ( 1.0 / Uncharted2Tonemap( vec3( 40.0 ) ) );
	
	// gamma correction
	nColor				= pow( nColor, vec3( 1.0 / GAMMA ) );

	//vec3 _l =  normalize(vWsPosition) - normalize(vEyePosition);
	//vec3 finalColor =  applyFog(nColor, fogColor, length(_l), FOG);

	nColor *= (1. - linearDepth);
	gl_FragColor = vec4(nColor, 1.0);//vec4(1.0, 0.0, 0.0, 1.0);
	//gl_FragColor = vec4(vec3((1. - linearDepth)),1.0);
}

`


// float depth = rgbaDepth.r;
// float visibility = (shadowCoord.z > depth + 0.005) ? 0.7:1.0;
// 46 ' gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);\n' +

export default F
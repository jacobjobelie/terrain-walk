
import Saturation from './saturation'

const F = `

// basic.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;

uniform sampler2D texture;
uniform sampler2D textureHeight;
uniform sampler2D 	uAoMap;
uniform sampler2D 	uAlbedo;

uniform float		uExposure;
uniform float		uGamma;
uniform float		uAoStrength;
uniform float		uSaturation;

const float A = 0.15;
const float B = 0.50;
const float C = 0.10;
const float D = 0.20;
const float E = 0.02;
const float F = 0.30;


${Saturation}

vec3 Uncharted2Tonemap( vec3 x )
{
	return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}

// https://www.unrealengine.com/blog/physically-based-shading-on-mobile
vec3 EnvBRDFApprox( vec3 SpecularColor, float Roughness, float NoV )
{
	const vec4 c0 = vec4( -1, -0.0275, -0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, -0.04 );
	vec4 r = Roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( -9.28 * NoV ) ) * r.x + r.y;
	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
	return SpecularColor * AB.x + AB.y;
}


// http://the-witness.net/news/2012/02/seamless-cube-map-filtering/
vec3 fix_cube_lookup( vec3 v, float cube_size, float lod ) {
	float M = max(max(abs(v.x), abs(v.y)), abs(v.z));
	float scale = 1.0 - exp2(lod) / cube_size;
	if (abs(v.x) != M) v.x *= scale;
	if (abs(v.y) != M) v.y *= scale;
	if (abs(v.z) != M) v.z *= scale;
	return v;
}

vec3 correctGamma(vec3 color, float g) {
	return pow(color, vec3(1.0/g));
}

void main(void) {
	vec3 outColor = vec3(0.);
    vec4 color = texture2D(texture, vTextureCoord);

    outColor = color.rgb;
	
    vec3 albedo 			= texture2D(uAlbedo, vTextureCoord).rgb;
    float diffuseAmp = 1.0 - albedo.r ;

    outColor = changeSaturation(outColor, diffuseAmp + uSaturation);

    vec3 ao 			= texture2D(uAoMap, vTextureCoord).rgb;
	float ssao 			= smoothstep(uAoStrength, 1.0, ao.r);
	outColor 			*= ssao;

	// apply the tone-mapping
	outColor				= Uncharted2Tonemap( outColor * uExposure );
	// white balance
	outColor				= outColor * ( 1.0 / Uncharted2Tonemap( vec3( 40.0 ) ) );
	
	// gamma correction
	outColor				= pow( outColor, vec3( 1.0 / uGamma ) );


    gl_FragColor = vec4(outColor ,1.0);
}

`

export default F
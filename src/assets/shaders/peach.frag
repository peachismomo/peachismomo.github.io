#version 300 es
precision highp float;

in vec3 v_fragPos;
in vec2 v_uv;
in mat3 v_TBN;

layout(location = 0) out vec4 fFragColor;

uniform vec3 u_lightPos;
uniform vec3 u_lightClr;
uniform vec3 u_viewPos;

// PBR textures
uniform sampler2D u_baseColorTex;
uniform sampler2D u_normalTex;
uniform sampler2D u_metallicRoughnessTex; // glTF packed: G=roughness, B=metallic
uniform sampler2D u_occlusionTex;          // usually R
uniform sampler2D u_emissiveTex;

// factors
uniform float u_lightIntensity;
uniform vec4 u_baseColorFactor;
uniform float u_metallicFactor;
uniform float u_roughnessFactor;
uniform vec3 u_emissiveFactor;

uniform float u_normalScale;
uniform float u_occlusionStrength;

uniform int u_alphaMode;
uniform float u_alphaCutoff;

uniform float u_ambience;
uniform float u_halfLambertPow;

const float PI = 3.14159265359f;
const vec3 NonMetallicF0 = vec3(0.04f);

float saturate(float x) {
    return clamp(x, 0.0f, 1.0f);
}

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0f - F0) * pow(clamp(1.0f - cosTheta, 0.0f, 1.0f), 5.0f);
}

float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0f);
    float NdotH2 = NdotH * NdotH;

    float num = a2;
    float denom = (NdotH2 * (a2 - 1.0f) + 1.0f);
    denom = PI * denom * denom;

    return num / max(denom, 1e-7f);
}

float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0f);
    float k = (r * r) / 8.0f;

    float num = NdotV;
    float denom = NdotV * (1.0f - k) + k;

    return num / max(denom, 1e-7f);
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0f);
    float NdotL = max(dot(N, L), 0.0f);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}

void main() {
    // ---- sample textures ----
    vec4 baseSample = texture(u_baseColorTex, v_uv) * u_baseColorFactor;

    // alpha mask
    if(u_alphaMode == 1) {
        if(baseSample.a < u_alphaCutoff)
            discard;
    }

    vec4 mr = texture(u_metallicRoughnessTex, v_uv);
    float rough = clamp(mr.g * u_roughnessFactor, 0.04f, 1.0f);
    float metal = clamp(mr.b * u_metallicFactor, 0.0f, 1.0f);

    float ao = mix(1.0f, texture(u_occlusionTex, v_uv).r, u_occlusionStrength);
    vec3 emission = texture(u_emissiveTex, v_uv).rgb * u_emissiveFactor;

    // normal map (tangent -> world)
    vec3 nTS = texture(u_normalTex, v_uv).xyz * 2.0f - 1.0f;
    nTS.xy *= u_normalScale;

    // If normal maps look inverted on some assets, uncomment:
    nTS.y *= -1.0;

    vec3 N = normalize(v_TBN * nTS);

    // view/light vectors
    vec3 V = normalize(u_viewPos - v_fragPos);
    vec3 lightVec = u_lightPos - v_fragPos;
    vec3 L = normalize(lightVec);
    vec3 H = normalize(V + L);

    // attenuation (inverse square)
    float dist = length(lightVec);
    float attenuation = 1.0f / max(dist * dist, 1e-4f);
    vec3 radiance = u_lightClr * attenuation * u_lightIntensity;

    // F0
    vec3 albedo = baseSample.rgb;
    vec3 F0 = mix(NonMetallicF0, albedo, metal);

    // Cook-Torrance BRDF
    float NDF = DistributionGGX(N, H, rough);
    float G = GeometrySmith(N, V, L, rough);
    vec3 F = fresnelSchlick(max(dot(H, V), 0.0f), F0);

    vec3 kS = F;
    vec3 kD = (vec3(1.0f) - kS) * (1.0f - metal);

    vec3 numerator = NDF * G * F;
    float denom = 4.0f * max(dot(N, V), 0.0f) * max(dot(N, L), 0.0f) + 1e-4f;
    vec3 specular = numerator / denom;

    // Half lambert
    float lambert = max(dot(N, L), 0.0f);
    float halfLambert = pow(0.5f * lambert + 0.5f, max(u_halfLambertPow, 1.0f));

    vec3 Lo = (kD * albedo / PI + specular) * radiance * halfLambert;

    // cheap ambient (matches your Pass0 style)
    vec3 ambient = u_ambience * albedo * ao;

    vec3 color = ambient + Lo + emission;

    // alpha output
    float outA = (u_alphaMode == 2) ? baseSample.a : 1.0f;
    fFragColor = vec4(color, outA);
}

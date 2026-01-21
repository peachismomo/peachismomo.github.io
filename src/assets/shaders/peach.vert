#version 300 es
precision highp float;

layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec3 a_nor;
layout(location = 2) in vec2 a_uv;
layout(location = 3) in vec4 a_tangent; // xyz=tangent, w=handedness

uniform mat4 u_world;
uniform mat4 u_view;
uniform mat4 u_proj;

out vec3 v_fragPos;
out vec2 v_uv;
out mat3 v_TBN;

void main() {
    vec4 worldPos = u_world * vec4(a_pos, 1.0f);
    v_fragPos = worldPos.xyz;
    v_uv = a_uv;

    mat3 normalMat = transpose(inverse(mat3(u_world)));

    vec3 N = normalize(normalMat * a_nor);
    vec3 T = normalize(normalMat * a_tangent.xyz);

    T = normalize(T - N * dot(N, T));
    vec3 B = cross(N, T) * a_tangent.w;

    v_TBN = mat3(T, B, N);

    gl_Position = u_proj * u_view * worldPos;
}

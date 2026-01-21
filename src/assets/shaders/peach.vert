#version 300 es
precision highp float;

layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec3 a_nor;
layout(location = 2) in vec2 a_uv;

uniform mat4 u_world; // translation/rotation/scale
uniform mat4 u_view; // camera
uniform mat4 u_proj; // perspective

out vec3 v_nml;
out vec3 v_fragPos;

void main() {
    vec4 worldPos = u_world * vec4(a_pos, 1.0f);
    v_fragPos = worldPos.xyz;
    mat3 normalMat = transpose(inverse(mat3(u_world)));
    v_nml = normalize(normalMat * a_nor);
    gl_Position = u_proj * u_view * worldPos;
}
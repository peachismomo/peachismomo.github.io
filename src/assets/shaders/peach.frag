#version 300 es
precision highp float;

in vec3 v_nml;
in vec3 v_fragPos;

layout(location = 0) out vec4 fFragColor;

uniform vec3 u_lightPos;
uniform vec3 u_lightClr;

// add this
uniform vec3 u_viewPos;

// tweakables
uniform float u_ambientStrength; // e.g. 0.08
uniform float u_specStrength;    // e.g. 0.5
uniform float u_shininess;       // e.g. 64.0

void main() {
    vec3 N = normalize(v_nml);

    // Ambient
    vec3 ambient = u_ambientStrength * u_lightClr;

    // Diffuse
    vec3 L = normalize(u_lightPos - v_fragPos);
    float diff = max(dot(N, L), 0.0);
    vec3 diffuse = diff * u_lightClr;

    // Blinn-Phong specular
    vec3 V = normalize(u_viewPos - v_fragPos);
    vec3 H = normalize(L + V); // halfway vector
    float spec = pow(max(dot(N, H), 0.0), u_shininess);
    vec3 specular = u_specStrength * spec * u_lightClr;

    vec3 color = ambient + diffuse + specular;
    fFragColor = vec4(color, 1.0);
}

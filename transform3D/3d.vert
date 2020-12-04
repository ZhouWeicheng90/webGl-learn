attribute vec4 a_position;
uniform mat4 u_matrix;

attribute vec4 a_color;
varying vec4 v_color;
void main() {
    v_color = a_color;
    vec4 position = u_matrix * a_position;
    gl_Position = position;
}
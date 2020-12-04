attribute vec2 a_position;
uniform mat3 u_transform;
void main() {
    vec2 pos = (u_transform * vec3(a_position, 1)).xy; 
    gl_Position = vec4(pos, 0, 1);
}
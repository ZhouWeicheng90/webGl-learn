attribute vec4 a_position;
uniform mat4 u_matrix;

// uniform float u_fudgeFactor;

attribute vec4 a_color;
varying vec4 v_color;
void main() {
    v_color = a_color;
    vec4 position = u_matrix * a_position; // vec4 中xyzw z默认是0，w默认是1，所以在三维的position中，看起来比二维简洁
    
    // float zToDivideBy = 1.0 + position.z * u_fudgeFactor;  // 生成透视投影因子    
    // gl_Position = vec4(position.xy / zToDivideBy, position.zw);  // x,y除以透视因子
    // gl_Position = vec4(position.xyz, zToDivideBy);    // w 就是透视因子，这一句和上一句是等价的！

    // 参考透视因子矩阵，z2m方法中，直接将 (x,y,z,w)*matrix变成（x,y,z, z*factor+w)    
    gl_Position = position; // 透视因子添加到了matrix中了！！！
}
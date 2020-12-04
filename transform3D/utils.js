/**
 * 
 * @param {string} url 
 * @returns {Promise<string>}
 */
function getText(url) {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url)
    xhr.send()
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = e => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText)
                } else {
                    reject(new Error(xhr.status))
                }
            }
        }
        xhr.onabort = xhr.onerror = xhr.ontimeout = e => {
            reject(e)
        }

    })
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {number} type 
 * @param {string} source 
 */
function getShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader
    }
    const msg = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(msg)
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string} vertUrl 
 * @param {string} fragUrl 
 */
export async function getProgram(gl, vertUrl, fragUrl) {
    let vertSource, fragSource;
    await Promise.all([
        getText(vertUrl).then(res => {
            vertSource = res
        }),
        getText(fragUrl).then(res => {
            fragSource = res
        })
    ])

    const vertShader = getShader(gl, gl.VERTEX_SHADER, vertSource)
    const fragShader = getShader(gl, gl.FRAGMENT_SHADER, fragSource)

    const program = gl.createProgram()
    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program
    }
    const msg = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(msg)
}




/**
 * @param {Array<number>} ar1 
 * @param {Array<number>} ar2 
 * @param {3|4} p
 */
function multipleMatrix(p, ar1, ar2) {
    /**
     * 
     * @param {Array<number>} li 
     * @param {Array<number>} cj 
     */
    function item(li, cj) {
        let buf = 0;
        for (let i = 0; i < li.length; i++) {
            buf += ar1[li[i]] * ar2[cj[i]]
        }
        return buf
    }

    let res = []
    let clarr = Array(p).fill(0)

    for (let i = 0; i < p; i++) {
        let li = clarr.map((ele, ind) => i * p + ind)

        for (let j = 0; j < p; j++) {
            let cj = clarr.map((ele, ind) => ind * p + j)
            res.push(item(li, cj))
        }
    }
    return res
}

/**
 * 
 * @param {number} deg 
 */
function getSC(deg) {
    let arc = deg * Math.PI / 180
    let c = Math.cos(arc)
    let s = Math.sin(arc)
    return { c, s }
}

export function d2(right2left = true) {
    let matx = [1, 0, 0, 0, 1, 0, 0, 0, 1]
    const obj = {
        result() {
            return matx
        },
        // 最后投影
        project(width, height) {
            let buf = [2.0 / width, 0, 0, 0, -2.0 / height, 0, -1, 1, 1]
            if (right2left) {
                matx = multipleMatrix(3, buf, matx)
            } else {
                matx = multipleMatrix(3, matx, buf)
            }
            return obj
        },
        translate(x = 0, y = 0) {
            let buf = [1, 0, 0, 0, 1, 0, x, y, 1]
            if (right2left) {
                matx = multipleMatrix(3, buf, matx)
            } else {
                matx = multipleMatrix(3, matx, buf)
            }
            return obj
        },
        rotate(deg = 0) {
            let { c, s } = getSC(deg)
            let buf = [c, s, 0, -s, c, 0, 0, 0, 1]
            if (right2left) {
                matx = multipleMatrix(3, buf, matx)
            } else {
                matx = multipleMatrix(3, matx, buf)
            }
            return obj

        },
        scale(sx = 1, sy = 1) {
            let buf = [sx, 0, 0, 0, sy, 0, 0, 0, 1]
            if (right2left) {
                matx = multipleMatrix(3, buf, matx)
            } else {
                matx = multipleMatrix(3, matx, buf)
            }
            return obj
        }
    }
    return obj
}
// 文档中矩阵相乘是反着的，个人感觉不好理解
// 文档认为是右结合的方式，感觉操作的都是坐标系，整个坐标系在旋转，在缩放，在平移，这与文档说明的完全相反，感觉左结合方式才是操作图形，可能是左右脑的区别吧。
// 思考右结合  缩放 平移，先缩放导致平移距离等比缩放了；旋转 平移，先旋转 导致平移方向变了。
// mat*vec 矩阵必须在前，否则无效！（矢量是一个竖型的矩阵）

// 正射投影
// 3d中，宽高的运用范围是 0-width，0-height，但depth的范围则是 -depth/2到depth/2
// 现在对于depth我们不平移-1， 那么 0-depth对应的gl坐标是0-2，  实际使用的范围正好对应 -1 到 1 

// 通过透视矩阵明确了 vec4是一个 1*3矩阵， 而mat4*vec4 进而明确了：glsl中矩阵相乘是右结合的！！！
// 开启右结合思维的图形（实在不符合我的思维习惯）

// float zToDivideBy = 1.0 + position.z * u_fudgeFactor;  // 生成透视投影因子    
// gl_Position = vec4(position.xy / zToDivideBy, position.zw);  // x,y除以透视因子
// gl_Position = vec4(position.xyz, zToDivideBy);    // w 就是透视因子，这一句和上一句是等价的！
// z越大，开起来越小，z越大，物体越远。这和css z-index 不一样哦！

// z2m方法中，直接将 (x,y,z,w)*matrix变成（x,y,z, 1 + z*factor+w) 

// vec4 中xyzw z默认是0，w默认是1，所以在三维的position中，看起来比二维简洁


export function d3(right2left = true) {
    let matx = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    const obj = {
        result() {
            return matx
        },
        project(width, height, depth) {

            let buf = [
                2 / width, 0, 0, 0,
                0, -2 / height, 0, 0,
                0, 0, 2 / depth, 0,
                -1, 1, 0, 1
            ]
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }

            return obj
        },
        z2m(fudgeFactor) {
            let buf = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, fudgeFactor,
                0, 0, 0, 1,
            ]
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }
            return obj

        },
        /**
         * 这是 project 和 z2m 两个方法的结合！
         */
        projection(width, height, depth, fudgeFactor = 0) {
            let buf = [
                2 / width, 0, 0, 0,
                0, -2 / height, 0, 0,
                0, 0, 2 / depth, 2 * fudgeFactor / depth,
                -1, 1, 0, 1
            ]
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }

            return obj
        },

        perspective2: function (deg, aspect, near, far) {
            let fieldOfViewInRadians = deg * Math.PI / 180
            const t = Math.tan(0.5 * fieldOfViewInRadians)
            var rangeInv = 1.0 / (far - near);
            let buf = [
                1 / t / aspect, 0, 0, 0,
                0, 1 / t, 0, 0,
                0, 0, far * rangeInv, 1,
                0, 0, near * far * rangeInv * -1, 0
            ];
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }

            return obj
        },
        perspective: function (deg, aspect, near, far) {
            let fieldOfViewInRadians = deg * Math.PI / 180
            const t = Math.tan(0.5 * fieldOfViewInRadians)
            var rangeInv = 1.0 / (far - near);
            let buf = [
                1 / t / aspect, 0, 0, 0,
                0, 1 / t, 0, 0,
                0, 0, (near + far) * rangeInv * -1, -1,
                0, 0, near * far * rangeInv * 2 * -1, 0
            ];
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }

            return obj
        },

        translate(x = 0, y = 0, z = 0) {
            let buf = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }
            return obj

        },
        scale(sx = 1, sy = 1, sz = 1) {
            let buf = [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }
            return obj
        },
        rotateZ(deg) {
            let { c, s } = getSC(deg)
            let buf = [
                c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }
            return obj
        },
        rotateX(deg) {
            let { c, s } = getSC(deg)
            let buf = [
                1, 0, 0, 0,
                0, c, -s, 0,
                0, s, c, 0,
                0, 0, 0, 1]
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }
            return obj
        },
        rotateY(deg) {
            let { c, s } = getSC(deg)
            let buf = [
                c, 0, s, 0,
                0, 1, 0, 0,
                -s, 0, c, 0,
                0, 0, 0, 1]
            if (right2left) {
                matx = multipleMatrix(4, buf, matx)
            } else {
                matx = multipleMatrix(4, matx, buf)
            }
            return obj
        },
    }
    return obj
}

export const FGeo = [
    // front
    0, 0, 0,
    0, 150, 0,
    30, 0, 0,
    0, 150, 0,
    30, 150, 0,
    30, 0, 0,

    30, 0, 0,
    30, 30, 0,
    100, 0, 0,
    30, 30, 0,
    100, 30, 0,
    100, 0, 0,

    30, 60, 0,
    30, 90, 0,
    67, 60, 0,
    30, 90, 0,
    67, 90, 0,
    67, 60, 0,

    //  back
    0, 0, 30,
    30, 0, 30,
    0, 150, 30,
    0, 150, 30,
    30, 0, 30,
    30, 150, 30,

    30, 0, 30,
    100, 0, 30,
    30, 30, 30,
    30, 30, 30,
    100, 0, 30,
    100, 30, 30,

    30, 60, 30,
    67, 60, 30,
    30, 90, 30,
    30, 90, 30,
    67, 60, 30,
    67, 90, 30,

    // top
    0, 0, 0,
    100, 0, 0,
    100, 0, 30,
    0, 0, 0,
    100, 0, 30,
    0, 0, 30,

    // top rung right
    100, 0, 0,
    100, 30, 0,
    100, 30, 30,
    100, 0, 0,
    100, 30, 30,
    100, 0, 30,

    // under top rung
    30, 30, 0,
    30, 30, 30,
    100, 30, 30,
    30, 30, 0,
    100, 30, 30,
    100, 30, 0,

    // between top rung and middle
    30, 30, 0,
    30, 60, 30,
    30, 30, 30,
    30, 30, 0,
    30, 60, 0,
    30, 60, 30,

    // top of middle rung
    30, 60, 0,
    67, 60, 30,
    30, 60, 30,
    30, 60, 0,
    67, 60, 0,
    67, 60, 30,

    // right of middle rung
    67, 60, 0,
    67, 90, 30,
    67, 60, 30,
    67, 60, 0,
    67, 90, 0,
    67, 90, 30,

    // bottom of middle rung.
    30, 90, 0,
    30, 90, 30,
    67, 90, 30,
    30, 90, 0,
    67, 90, 30,
    67, 90, 0,

    // right of bottom
    30, 90, 0,
    30, 150, 30,
    30, 90, 30,
    30, 90, 0,
    30, 150, 0,
    30, 150, 30,

    // bottom
    0, 150, 0,
    0, 150, 30,
    30, 150, 30,
    0, 150, 0,
    30, 150, 30,
    30, 150, 0,

    // left side
    0, 0, 0,
    0, 0, 30,
    0, 150, 30,
    0, 0, 0,
    0, 150, 30,
    0, 150, 0];
export const colors4FGeo = [
    // front
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,

    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,

    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,
    200, 70, 120,

    //  back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,

    // top
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,

    // top rung right
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,

    // under top rung
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,

    // between top rung and middle
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,

    // top of middle rung
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,

    // right of middle rung
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,

    // bottom of middle rung.
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,

    // right of bottom
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,

    // bottom
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,

    // left side
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220];
export const trangleGeo = [
    // 背面
    0, 0, 0,
    200, 0, 0,
    0, 200, 0,
    // 正面
    0, 200, 30,
    200, 0, 30,
    0, 0, 30,
    // 左侧面
    0, 0, 0,
    0, 200, 0,
    0, 200, 30,
    0, 200, 30,
    0, 0, 30,
    0, 0, 0,

    // 斜面
    0, 200, 30,
    0, 200, 0,
    200, 0, 0,
    200, 0, 0,
    200, 0, 30,
    0, 200, 30,

    // 上侧面
    200, 0, 0,
    0, 0, 0,
    200, 0, 30,
    0, 0, 0,
    0, 0, 30,
    200, 0, 30,
];
export const colors4trangleGeo = [
    200, 0, 0,
    200, 0, 0,
    200, 0, 0,

    0, 70, 0,
    0, 70, 0,
    0, 70, 0,

    100, 100, 250,
    100, 100, 250,
    100, 100, 250,
    100, 100, 250,
    100, 100, 250,
    100, 100, 250,

    0, 0, 200,
    0, 0, 200,
    0, 0, 200,
    0, 0, 200,
    0, 0, 200,
    0, 0, 200,

    100, 120, 200,
    100, 120, 200,
    100, 120, 200,
    100, 120, 200,
    100, 120, 200,
    100, 120, 200,
];


/**
 * 
 * @param {string} url 
 * @returns {Promise<string>}
 */
export function getText(url) {
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
export function getShader(gl, type, source) {
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
    const vertSource = await getText(vertUrl)
    const vertShader = getShader(gl, gl.VERTEX_SHADER, vertSource)
    const fragSource = await getText(fragUrl)
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


// 文档中矩阵相乘是反着的，个人感觉不好理解
// 文档认为是右结合的方式，感觉操作的都是坐标系，整个坐标系在旋转，在缩放，在平移，这与文档说明的完全相反，感觉左结合方式才是操作图形，可能是左右脑的区别吧。
// 思考右结合  缩放 平移，先缩放导致平移距离等比缩放了；旋转 平移，先旋转 导致平移方向变了。
/**
 * @param {Array<number>} ar1 
 * @param {Array<number>} ar2 
 */
function multipleMatrix(ar1, ar2) {
    /**
     * 
     * @param {Array<number>} is 
     * @param {Array<number>} js 
     */
    function item(is, js) {
        let buf = 0;
        for (let i = 0; i < is.length; i++) {
            buf += ar1[is[i]] * ar2[js[i]]
        }
        return buf
    }
    return [
        item([0, 1, 2], [0, 3, 6]), item([0, 1, 2], [1, 4, 7]), item([0, 1, 2], [2, 5, 8]),
        item([3, 4, 5], [0, 3, 6]), item([3, 4, 5], [1, 4, 7]), item([3, 4, 5], [2, 5, 8]),
        item([6, 7, 8], [0, 3, 6]), item([6, 7, 8], [1, 4, 7]), item([6, 7, 8], [2, 5, 8])
    ]
}

export function m3() {
    let matx = [1, 0, 0,
        0, 1, 0,
        0, 0, 1]
    let obj = {
        result() {
            return matx
        },
        // 最后投影
        project(width,height){
            matx = multipleMatrix(matx, [2.0/width, 0, 0,                0, -2.0/height, 0,               -1, 1, 1])
            return obj
        },
        translate(x = 0, y = x) {
            matx = multipleMatrix(matx, [1, 0, 0,                0, 1, 0,                x, y, 1])            
            return obj
        },
        rotate(deg = 0) {
            let arc = deg * Math.PI / 180
            let c = Math.cos(arc)
            let s = Math.sin(arc)
            matx = multipleMatrix(matx, [c, s, 0,                -s, c, 0,                0, 0, 1])           
            return obj

        },
        scale(sx = 1, sy = sx) {
            matx = multipleMatrix(matx, [sx, 0, 0,                0, sy, 0,                0, 0, 1])            
            return obj
        }
    }
    return obj
}
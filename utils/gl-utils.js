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
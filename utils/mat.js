/**
 * @param {Array<number>} mat1
 * @param {Array<number>} mat2
 * @param {Array<number>} li 
 * @param {Array<number>} cj 
 */
function __item(mat1, mat2, li, cj) {
    let buf = 0;
    for (let i = 0; i < li.length; i++) {
        buf += mat1[li[i]] * mat2[cj[i]]
    }
    return buf
}
/**
 * @param {Array<number>} ar1 
 * @param {Array<number>} ar2 
 * @param {3|4} p
 */
export function multipleMatrix(p, ar1, ar2) {
    let res = []
    let clarr = Array(p).fill(0)
    for (let i = 0; i < p; i++) {
        let li = clarr.map((ele, ind) => i * p + ind)
        for (let j = 0; j < p; j++) {
            let cj = clarr.map((ele, ind) => ind * p + j)
            res.push(__item(ar1, ar2, li, cj))
        }
    }
    return res
}

/**
 * 
 * @param {number} deg 
 */
export function getSC(deg) {
    let arc = deg * Math.PI / 180
    let c = Math.cos(arc)
    let s = Math.sin(arc)
    return { c, s }
}
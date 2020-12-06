import { multipleMatrix } from './mat.js'
import { LeftBase, RightBase } from './d3-base.js'

function _ps(deg, aspect, near, far) {
    const k = Math.tan((180 - deg) / 2 * Math.PI / 180)
    const rangeInv = 1 / (far - near);
    // // csdn:  经过测试，这段矩阵是有问题的，转换的3d图案存在变形和错位！    
    // return [
    //     k / aspect, 0, 0, 0,
    //     0, k, 0, 0,
    //     0, 0, far * rangeInv, 1,
    //     0, 0, near * far * rangeInv * -1, 0
    // ]

    // glsl fundamental:
    return [
        k / aspect, 0, 0, 0,
        0, k, 0, 0,
        0, 0, (near + far) * rangeInv * -1, -1,
        0, 0, near * far * rangeInv * -2, 0
    ]
}

export function d3_left(matrix) {
    let obj = new LeftBase(matrix)
    obj.perspective = function (deg, aspect, near, far) {
        obj.matx = multipleMatrix(4, obj.matx, _ps(deg, aspect, near, far))
        return obj
    }
    return obj
}


export function d3(matrix) {
    let obj = new RightBase(matrix)
    obj.perspective = function (deg, aspect, near, far) {
        obj.matx = multipleMatrix(4, _ps(deg, aspect, near, far), obj.matx)
        return obj
    }
    return obj
}





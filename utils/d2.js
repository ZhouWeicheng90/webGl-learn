import { multipleMatrix, getSC } from './mat.js'
function _t(x, y) {
    return [1, 0, 0, 0, 1, 0, x, y, 1]
}
function _s(sx, sy) {
    return [sx, 0, 0, 0, sy, 0, 0, 0, 1]
}
function _r(deg) {
    let { c, s } = getSC(deg)
    return [c, s, 0, -s, c, 0, 0, 0, 1]
}
function _prj(width, height) {
    return [2.0 / width, 0, 0, 0, -2.0 / height, 0, -1, 1, 1]
}

class Base {
    matx;
    constructor(matrix) {
        if (Array.isArray(matrix)) {
            this.matx = matrix
        } else {
            this.matx = [1, 0, 0, 0, 1, 0, 0, 0, 1]
        }
    }
    result() {
        return this.matx
    }
}
export function d2(matrix) {
    let obj = new Base(matrix)
    Object.assign(obj, {
        project(width, height) {
            obj.matx = multipleMatrix(3, _prj(width, height), obj.matx)
            return obj
        },
        translate(x = 0, y = 0) {
            obj.matx = multipleMatrix(3, _t(x, y), obj.matx)
            return obj
        },
        rotate(deg = 0) {
            obj.matx = multipleMatrix(3, _r(deg), obj.matx)
            return obj
        },
        scale(sx = 1, sy = 1) {
            obj.matx = multipleMatrix(3, _s(sx, sy), obj.matx)
            return obj
        }
    })
    return obj
}

export function d2_left(matrix) {
    let obj = new Base(matrix)
    Object.assign(obj, {
        project(width, height) {
            obj.matx = multipleMatrix(3, obj.matx, _prj(width, height))
            return obj
        },
        translate(x = 0, y = 0) {
            obj.matx = multipleMatrix(3, obj.matx, _t(x, y))
            return obj
        },
        rotate(deg = 0) {
            obj.matx = multipleMatrix(3, obj.matx, _r(deg))
            return obj
        },
        scale(sx = 1, sy = 1) {
            obj.matx = multipleMatrix(3, obj.matx, _s(sx, sy))
            return obj
        }
    })
    return obj
}
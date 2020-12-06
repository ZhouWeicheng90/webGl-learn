import { multipleMatrix, getSC } from './mat.js'
function _t(x, y, z) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]
}
function _s(sx, sy, sz) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]
}
function _rx(deg) {
    let { c, s } = getSC(deg)
    return [
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1]

}
function _ry(deg) {
    let { c, s } = getSC(deg)
    return [
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1]

}
function _rz(deg) {
    let { c, s } = getSC(deg)
    return [
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]

}

class Base {
    matx;
    constructor(matrix) {
        if (Array.isArray(matrix)) {
            this.matx = matrix
        } else {
            this.matx = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
        }
    }
    result() {
        return this.matx
    }
}

export class LeftBase extends Base {
    constructor(matrix) {
        super(matrix)
    }
    translate(x = 0, y = 0, z = 0) {
        this.matx = multipleMatrix(4, this.matx, _t(x, y, z))
        return this
    }
    scale(sx = 1, sy = 1, sz = 1) {
        this.matx = multipleMatrix(4, this.matx, _s(sx, sy, sz))
        return this
    }
    rotateZ(deg) {
        this.matx = multipleMatrix(4, this.matx, _rz(deg))
        return this
    }
    rotateX(deg) {
        this.matx = multipleMatrix(4, this.matx, _rx(deg))
        return this
    }
    rotateY(deg) {
        this.matx = multipleMatrix(4, this.matx, _ry(deg))
        return this
    }
}



export class RightBase extends Base {
    constructor(matrix) {
        super(matrix)
    }
    translate(x = 0, y = 0, z = 0) {
        this.matx = multipleMatrix(4, _t(x, y, z), this.matx)
        return this
    }
    scale(sx = 1, sy = 1, sz = 1) {
        this.matx = multipleMatrix(4, _s(sx, sy, sz), this.matx)
        return this
    }
    rotateZ(deg) {
        this.matx = multipleMatrix(4, _rz(deg), this.matx)
        return this
    }
    rotateX(deg) {
        this.matx = multipleMatrix(4, _rx(deg), this.matx)
        return this
    }
    rotateY(deg) {
        this.matx = multipleMatrix(4, _ry(deg), this.matx)
        return this
    }
}
import { multipleMatrix } from './mat.js'
import {LeftBase,RightBase} from './d3-base.js'
function _prj(width, height, depth) {
    return [
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 2 / depth, 0,
        -1, 1, 0, 1
    ]
}
function _zs(fudgeFactor) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, fudgeFactor,
        0, 0, 0, 1,
    ]
}
function _prj_zs(width, height, depth, fudgeFactor) {
    return [
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 2 / depth, 2 * fudgeFactor / depth,
        -1, 1, 0, 1
    ]
}
export function d3z_left(matrix) {
    let obj = new LeftBase(matrix)
    obj.project = function (width, height, depth) {
        obj.matx = multipleMatrix(4, obj.matx, _prj(width, height, depth))
        return obj
    }
    obj.z2m = function (fudgeFactor) {
        obj.matx = multipleMatrix(4, obj.matx, _zs(fudgeFactor))
        return obj
    }
    obj.project_z2m = function (width, height, depth, fudgeFactor = 0) {
        obj.matx = multipleMatrix(4, obj.matx, _prj_zs(width, height, depth, fudgeFactor))
        return obj
    }    
    return obj
}


export function d3z(matrix) {
    let obj = new RightBase(matrix)
    obj.project = function (width, height, depth) {
        obj.matx = multipleMatrix(4, _prj(width, height, depth), obj.matx)
        return obj
    }
    obj.z2m = function (fudgeFactor) {
        obj.matx = multipleMatrix(4, _zs(fudgeFactor), obj.matx)
        return obj
    }
    obj.project_z2m = function (width, height, depth, fudgeFactor = 0) {
        obj.matx = multipleMatrix(4, _prj_zs(width, height, depth, fudgeFactor), obj.matx)
        return obj
    }   
    return obj
}
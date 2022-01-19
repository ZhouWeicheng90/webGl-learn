// @ts-check
/** 
 * @typedef {{order:string, nums:number[]}} Command 
 * */
/**
 * @param {string} str 
 * @param {boolean} toAbsolute 
 */
export function translatePath(str, toAbsolute) {
    const commands = parseCommands(str)
    let buf = [];
    let x = 0, y = 0;
    for (let cmd of commands) {
        let res = transCommandCore(cmd, toAbsolute, x, y)
        x = res.x
        y = res.y;
        buf.push(res.cmd)
    }
    return stringifyCommands(buf)
}

export function normalizePath(str, viewBoxX2, viewBoxY2, viewBoxX1 = 0, viewBoxY1 = 0) {
    let W = viewBoxX2 - viewBoxX1, H = viewBoxY2 - viewBoxY1;
    const commands = parseCommands(str)
    let cmds = []
    for (let cmd of commands) {
        let buf = normalizeCommandCore(cmd, viewBoxX1, viewBoxY1, W, H);
        cmds.push(buf)
    }
    return stringifyCommands(cmds)
}

/**
 * @returns {Command}
 * @param {Command} param0 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 */
function normalizeCommandCore({ order, nums }, x, y, w, h) {
    const len = nums.length;
    if (/[csqtzml]/i.test(order)) {
        let ns = []
        for (let i = 0; i < len - 1; i += 2) {
            if (order.toUpperCase() === order) {
                ns.push((nums[i] - x) / w, (nums[i + 1] - y) / h)
            } else {
                ns.push(nums[i] / w, nums[i + 1] / h)
            }
        }
        return { order, nums: ns }
    }
    if (['h', 'H', 'v', 'V'].includes(order)) {
        let n = nums[0]
        if ('h' === order) {
            n = n / w
        } else if ('H' === order) {
            n = (n - x) / w

        } else if ('v' === order) {
            n = n / h
        } else {
            n = (n - y) / h
        }
        return { order, nums: [n] }
    }
    if (/a/i.test(order)) {
        const ns = nums.slice()
        ns[0] /= w;
        ns[1] /= h;
        ns[5] = 'a' === order ? ns[5] / w : (ns[5] - x) / w
        ns[6] = 'a' === order ? ns[6] / h : (ns[6] - y) / h
        return { order, nums: ns }
    }
}


/**
 * @returns {{cmd:Command,x:number,y:number}}
 * @param {Command} p 
 */
function transCommandCore({ order, nums }, toAbsolute, x, y) {
    const len = nums.length;
    if (/[csqtzml]/i.test(order)) {
        // 普通指令
        if (len === 0) {
            order = toAbsolute ? order.toUpperCase() : order.toLowerCase()
            return { cmd: { order, nums: [] }, x, y }
        }
        if (toAbsolute && order.toUpperCase() === order || !toAbsolute && order.toLowerCase() === order) {
            let cmdX = nums[len - 2]
            let cmdY = nums[len - 1]
            if (toAbsolute) {
                x = cmdX;
                y = cmdY;
            } else {
                x += cmdX;
                y += cmdY;
            }
            return { cmd: { order, nums: nums.slice() }, x, y }
        }
        let nums2 = []
        if (toAbsolute) {
            // 相对转绝对           
            for (let i = 0; i < len; i += 2) {
                nums2.push(nums[i] + x, nums[i + 1] + y)
            }
            x = nums2[len - 2]
            y = nums2[len - 1]
            return { cmd: { order: order.toUpperCase(), nums: nums2 }, x, y }
        } else {
            // 绝对转相对            
            for (let i = 0; i < len; i += 2) {
                nums2.push(nums[i] - x, nums[i + 1] - y)
            }
            x = nums[len - 2]
            y = nums[len - 1]
            return { cmd: { order: order.toLowerCase(), nums: nums2 }, x, y }
        }

    }
    if (/h/i.test(order)) {
        if (order.toLowerCase() === order && !toAbsolute || order.toUpperCase() === order && toAbsolute) {
            return {
                cmd: { order, nums: nums.slice() },
                x: toAbsolute ? nums[0] : x + nums[0],
                y
            }
        }
        if (toAbsolute) {
            x += nums[0]
            return {
                cmd: { order: order.toUpperCase(), nums: [x] }, x, y
            }
        }
        return { cmd: { order: order.toLowerCase(), nums: [nums[0] - x] }, x: nums[0], y }
    }
    if (/v/i.test(order)) {
        if (order.toLowerCase() && !toAbsolute || order.toUpperCase() === order && toAbsolute) {
            return {
                cmd: { order, nums: nums.slice() },
                x,
                y: toAbsolute ? nums[0] : y + nums[0]
            }
        }
        if (toAbsolute) {
            y += nums[0]
            return {
                cmd: { order: order.toUpperCase(), nums: [y] }, x, y
            }
        }
        return { cmd: { order: order.toLowerCase(), nums: [nums[0] - y] }, x, y: nums[0] }
    }
    if (/a/i.test(order)) {
        // 特殊的 h(水平),v（垂直）,a（弧线）暂不支持
        const ns = nums.slice()

        if ('a' === order) {
            x += ns[5]
            y += ns[6]
            if (toAbsolute) {
                ns[5] = x;
                ns[6] = y
                return { cmd: { order: 'A', nums: ns }, x, y }
            } else {
                return { cmd: { order, nums: ns }, x, y }
            }

        } else {
            if (!toAbsolute) {
                ns[5] -= x;
                ns[6] -= y;
                x += ns[5]
                y += ns[6]
                return { cmd: { order: 'a', nums: ns }, x, y }
            } else {
                x = ns[5]
                y = ns[6]
                return { cmd: { order, nums: ns }, x, y }
            }

        }

    }

}

/**
 * 
 * @param {Command} cmd 
 */
function _validateCommandAndGetCmdLen({ order, nums }) {
    let len = nums.length;
    let oneLen = getNumsLength(order)
    if (Number.isNaN(oneLen) || 0 === oneLen && 0 !== len || 1 === oneLen && 1 !== len) {
        throw new Error(`错误的指令识别：${order} ${nums.join(' ')}`)
    }
    if (0 === oneLen && 0 === len || 1 === oneLen && 1 === len) {
        return 1;
    }
    if (len % oneLen === 0) {
        return len / oneLen;
    }
    throw new Error(`错误的指令识别：${order} ${nums.join(' ')}`)

}

/**
 * 
 * @param {string} order 
 */
function getNumsLength(order) {
    if (['z', 'Z'].includes(order)) {
        return 0;
    }
    if (['m', 'M', 'l', 'L', 't', 'T'].includes(order)) {

        return 2;
    }
    if (['q', 'Q', 's', 'S'].includes(order)) {
        return 4;
    }
    if (['c', 'C'].includes(order)) {
        return 6;
    }
    if (['h', 'H', 'v', 'V'].includes(order)) {
        return 1;
    }
    if (['a', 'A'].includes(order)) {
        return 7;
    }
    return NaN
}
/**
 * 
 * @param {string} str 
 * @returns {Command[]}
 */
function parseCommands(str) {
    str = str.replace(/,/g, ' ');
    let buf = [];
    do {
        let res = parseOneCommand(str)
        str = res.str
        const cmd = res.cmd
        let cmdLen = _validateCommandAndGetCmdLen(cmd);
        if (cmdLen > 1) {
            const oneLen = cmd.nums.length / cmdLen
            while (cmdLen--) {
                let oneCmd = { order: cmd.order, nums: cmd.nums.splice(0, oneLen) }
                buf.push(oneCmd)
            }
        } else {
            buf.push(cmd)
        }
    } while (str)
    return buf;
}

/**
 * @returns {string}
 * @param {Command[]} commands 
 */
function stringifyCommands(commands) {
    let str = ''
    for (let cmd of commands) {
        let { order, nums } = cmd
        let coodexs = []
        for (let i = 0; i < nums.length; i += 2) {
            coodexs.push([nums[i], nums[i + 1]].join(' '))
        }
        str += order + coodexs.join(' ')
    }
    return str;

}

/**
 * 
 * @param {string} s 
 */
function parseOneCommand(s) {
    s = s.trim()
    let order = s[0];
    s = s.substring(1);
    let nums = [];

    while (!Number.isNaN(Number.parseFloat(s))) {
        let num = Number.parseFloat(s);
        nums.push(num);
        s = s.replace(/^\s*[+-]?[0-9]*(\.[0-9]*)?/, '');
    }
    return { str: s, cmd: { order, nums } }
}

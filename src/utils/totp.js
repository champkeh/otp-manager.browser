import {base32Decode} from './base32Decode'
import {binb2hex, core_hmac_sha1} from './sha1'

function intToBytes(num) {
    const bytes = []

    for (let i = 7; i >= 0; --i) {
        bytes[i] = num & (255)
        num = num >> 8
    }

    return bytes
}

function hex2buf(hex) {
    const buf = []
    for (let i = 0; i < hex.length; i += 2) {
        buf.push(parseInt(hex.slice(i, i + 2), 16))
    }
    return buf
}

export function genCode(secret) {
    const T = Math.floor(Date.now() / 1000 / 30)
    const key = String.fromCharCode(...base32Decode(secret, 'RFC4648'))

    const digest = core_hmac_sha1(key, String.fromCharCode(...intToBytes(T)))
    const hs = hex2buf(binb2hex(digest))

    // 取出最后个字节的低 4 位
    const offset = hs[19] & 0xf

    // 将从 offset 开始的四个字节按大端组装为整数
    let bytes = (hs[offset] & 0x7f /** 这里是为了忽略符号位 */) << 24
        | hs[offset + 1] << 16
        | hs[offset + 2] << 8
        | hs[offset + 3]

    // 整数转字符串，然后取出后六位
    let code = bytes.toString().slice(-6);

    // 不足 6 位数则补 0
    for (let i = 0; i > 6 - code.length; i++) {
        code = '0' + code;
    }
    return code
}

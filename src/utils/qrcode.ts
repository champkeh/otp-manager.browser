import jsQR from "jsqr"
import {AccountType} from "@/index"

interface OTPSchemaParseResult {
    type: AccountType
    account: string
    secret?: string
    issuer?: string
}
/**
 * 解析 otp schema
 * @param url
 */
export function parseSchema(url: string): OTPSchemaParseResult | null {
    url = decodeURIComponent(url).replace(/&amp;/g, '&')
    const matchResult = url.match(/^otpauth:\/\/(?<type>.*?)\/(?<account>.*?)\?(?<params>.*)$/)
    if (!matchResult) {
        return null
    }
    const params = matchResult.groups!.params.split('&').reduce((prev: Record<string, any>, cur: string) => {
        const [name, value] = cur.split('=')
        prev[name] = value
        return prev
    }, {})
    return {
        type: matchResult.groups!.type as AccountType,
        account: matchResult.groups!.account,
        ...params,
    }
}

/**
 * 本地解析二维码
 * @param dataURL 图片数据(dataURL格式)
 */
export async function decodeQrCodeLocal(dataURL: string): Promise<string> {
    const res = await Jimp.read(dataURL)
    const {data, width, height} = res.bitmap
    const qrcode = jsQR(data, width, height)
    if (qrcode?.data) {
        return qrcode.data
    }
    throw new Error('解析失败')
}

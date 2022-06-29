import axios from "axios"

const http = axios.create({})

export function decodeQrCode(file) {
    return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('Filedata', file)
        http.post('https://upload.api.cli.im/upload.php?kid=cliim', formData).then(resp => {
            const {status, info, data} = resp.data
            if (status === '1') {
                return data.path
            } else {
                throw new Error(info)
            }
        }).then(url => {
            return http.post('https://cli.im/apis/up/deqrimg', `img=${encodeURIComponent(url)}`)
        }).then(resp => {
            const {status, info} = resp.data
            if (status === 1) {
                resolve(info.data[0])
            } else {
                throw new Error(info)
            }
        }).catch(reject)
    })
}

export function parseSchema(url) {
    return new Promise((resolve, reject) => {
        try {
            url = decodeURIComponent(url).replace(/&amp;/g, '&')
            const matchResult = url.match(/^otpauth:\/\/(?<type>.*?)\/(?<account>.*?)\?(?<params>.*)$/)
            const params = matchResult.groups.params.split('&').reduce((prev, cur) => {
                const [name, value] = cur.split('=')
                prev[name] = value
                return prev
            }, {})
            resolve({
                type: matchResult.groups.type,
                account: matchResult.groups.account,
                ...params,
            })
        } catch (e) {
            reject(e)
        }
    })
}

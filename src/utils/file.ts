import {decodeQrCodeLocal, parseSchema} from "@/utils/qrcode";

export function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', decodeURIComponent(filename))
    document.body.appendChild(link)

    link.click()
    setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }, 0)
}

type ReadAs = 'DataURL' | 'Text' | 'ArrayBuffer' | 'BinaryString'
type Accept = 'image/*' | 'application/json'

export function readFileContent(accept: Accept, readAs: ReadAs) {
    return new Promise((resolve, reject) => {
        const fileEl = document.createElement('input')
        fileEl.type = 'file'
        fileEl.accept = accept
        fileEl.style.visibility = 'hidden'
        fileEl.style.width = '0'
        fileEl.style.height = '0'
        document.body.appendChild(fileEl)
        fileEl.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files![0]
            if (file) {
                const reader = new FileReader()
                reader.onloadend = (evt) => {
                    resolve(evt.target!.result)
                }
                if (readAs === 'DataURL') {
                    reader.readAsDataURL(file)
                } else if (readAs === 'Text') {
                    reader.readAsText(file)
                } else if (readAs === 'ArrayBuffer') {
                    reader.readAsArrayBuffer(file)
                } else if (readAs === 'BinaryString') {
                    reader.readAsBinaryString(file)
                } else {
                    throw new Error(`readAs: ${readAs} not supported.`)
                }
            }
            setTimeout(() => {
                document.body.removeChild(fileEl)
            }, 0)
        })
        fileEl.click()
    })
}

import axios from "axios"

const http = axios.create({
    timeout: 0,
})

export function download(url: string): Promise<Blob> {
    return http.get(url, {
        responseType: "blob"
    }).then(resp => {
        return resp.data
    })
}

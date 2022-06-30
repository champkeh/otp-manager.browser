/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'uuid' {
    const v4: () => string
    export {v4}
}

interface JimpRes {
    bitmap: {
        data: any,
        width: number
        height: number
    }
}

declare const Jimp: {
    read(data: string): Promise<JimpRes>
}

import {defineConfig} from 'vite'
import {resolve} from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        rollupOptions: {
            input: {
                popup: resolve(__dirname, '/src/popup/entry.html'),
                options: resolve(__dirname, '/src/options/entry.html')
            }
        }
    },
    plugins: [vue()]
})

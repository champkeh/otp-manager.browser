import {defineStore} from 'pinia'
import {toRaw} from "vue";

interface SettingStoreState {
    enableProtect: boolean
    password?: string
}

export const useSettingStore = defineStore('SettingStore', {
    state: (): SettingStoreState => ({
        enableProtect: false
    }),
    actions: {
        async init() {
            const data = await chrome.storage.sync.get('setting')
            const setting = data.setting || {enableProtect: false, password: ''}
            this.enableProtect = setting.enableProtect
            this.password = setting.password
        },
        async update(enableProtect: boolean, password: string) {
            this.enableProtect = enableProtect
            this.password = password
            await this.sync()
        },
        async sync() {
            await chrome.storage.sync.set({
                setting: {
                    enableProtect: toRaw(this.enableProtect),
                    password: toRaw(this.password),
                }
            })
        }
    }
})

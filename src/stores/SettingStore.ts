import {defineStore} from 'pinia'
import {toRaw} from "vue";

interface SettingStoreState {
    enableProtect: boolean
    password: string
    lastExportDate: number
    latestAccountDate: number
}

export const useSettingStore = defineStore('SettingStore', {
    state: (): SettingStoreState => ({
        enableProtect: false,
        password: '',
        lastExportDate: 0,
        latestAccountDate: 0,
    }),
    actions: {
        async init() {
            const data = await chrome.storage.sync.get('setting')
            const setting = data.setting || {enableProtect: false, password: '', latestAccountDate: 0, lastExportDate: 0}
            this.enableProtect = setting.enableProtect
            this.password = setting.password
            this.lastExportDate = setting.lastExportDate
            this.latestAccountDate = setting.latestAccountDate

            // 自动同步保存的storage
            this.$subscribe((mutation, state) => {
                this.sync()
            })
        },
        async update(enableProtect: boolean, password: string = '') {
            this.enableProtect = enableProtect
            this.password = password
            await this.sync()
        },
        async sync() {
            await chrome.storage.sync.set({
                setting: {
                    enableProtect: toRaw(this.enableProtect),
                    password: toRaw(this.password),
                    lastExportDate: toRaw(this.lastExportDate),
                    latestAccountDate: toRaw(this.latestAccountDate),
                }
            })
        }
    }
})

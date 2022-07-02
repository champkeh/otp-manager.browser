import {toRaw} from 'vue'
import {defineStore} from 'pinia'
import {AccountInStorage, AccountType} from '@/index'
import {genCode} from "@/utils/totp"
import {v4 as uuid} from "uuid"
import {downloadBlob, readFileContent} from "@/utils/file"
import moment from "moment"
import {useSettingStore} from '@/stores/SettingStore'

interface AccountStoreState {
    accounts: AccountInStorage[]
}

export const useAccountStore = defineStore('AccountStore', {
    state(): AccountStoreState {
        return {
            accounts: []
        }
    },
    actions: {
        async init() {
            const data = await chrome.storage.sync.get('accounts')
            this.accounts = data.accounts || []
            await chrome.action.setBadgeText({text: this.accounts.length.toString()})
        },
        async add(name: string, secret: string, type: AccountType) {
            try {
                genCode(secret)
            } catch (e) {
                throw new Error(`密钥 "${secret}" 无效`)
            }

            this.accounts.push({
                id: uuid(),
                name: name,
                secret: secret,
                type: type,
            })
            await this.sync()

            // 更新最新账户添加时间
            const settingStore = useSettingStore()
            settingStore.latestAccountDate = Date.now()
        },
        async remove(id: string) {
            this.accounts = this.accounts.filter(account => account.id !== id)
            await this.sync()
        },
        async sync() {
            await chrome.storage.sync.set({accounts: toRaw(this.accounts)})
            await chrome.action.setBadgeText({text: this.accounts.length.toString()})
        },
        async exportAccount() {
            const file = new Blob([JSON.stringify(toRaw(this.accounts))], {type: 'application/json'})
            downloadBlob(file, `otp-manager-${moment().format('YYYY-MM-DDTHH_mm_ss_SSS')}.json`)

            // 更新最后导出时间
            const settingStore = useSettingStore()
            settingStore.lastExportDate = Date.now()
            // 恢复badge颜色
            await chrome.action.setBadgeBackgroundColor({color: [0,0,0,0]})
        },
        async importAccount() {
            try {
                let count = 0
                const fileContent = await readFileContent('application/json', 'Text')
                const importAccounts = JSON.parse(fileContent as string) as AccountInStorage[]
                importAccounts.forEach(account => {
                    if (!this.accounts.find(a => a.id === account.id)) {
                        this.accounts.push(account)
                        count++
                    } else {
                        console.warn(`${account.id}已存在`)
                    }
                })
                await this.sync()
                if (count > 0) {
                    setTimeout(() => {
                        alert(`成功导入 ${count} 条数据`)
                    }, 100)
                }
            } catch (e: any) {
                alert(e.message)
            }
        }
    }
})

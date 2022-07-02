import {toRaw} from 'vue'
import {defineStore} from 'pinia'
import {AccountInStorage, AccountType} from '@/index'
import {genCode} from "@/utils/totp"
import {v4 as uuid} from "uuid"
import {downloadBlob, readFileContent} from "@/utils/file"

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
        },
        async remove(id: string) {
            this.accounts = this.accounts.filter(account => account.id !== id)
            await this.sync()
        },
        async sync() {
            await chrome.storage.sync.set({accounts: toRaw(this.accounts)})
        },
        exportAccount() {
            const file = new Blob([JSON.stringify(toRaw(this.accounts))], {type: 'application/json'})
            downloadBlob(file, `otp-manager-${Date.now()}.json`)
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
                        console.warn(account.id, '已存在')
                    }
                })
                await this.sync()
                if (count > 0) {
                    alert(`成功导入 ${count} 条数据`)
                }
            } catch (e: any) {
                alert(e.message)
            }
        }
    }
})

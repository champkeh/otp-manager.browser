import {toRaw} from 'vue'
import {defineStore} from 'pinia'
import {AccountInStorage, AccountType} from '@/index'
import {genCode} from "@/utils/totp"
import {v4 as uuid} from "uuid"

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
        }
    }
})

export interface Account {
    id: string
    name: string
    secret: string
    group: string
    code: string
    countdown: number
    copy: boolean
}

export type AccountType = 'totp' | 'hotp'

export interface AccountInStorage {
    id: string
    name: string
    secret: string
    type: AccountType
    group: string
}

export interface Account {
    id: string
    name: string
    secret: string
    code: string
    countdown: number
}

export type AccountType = 'totp' | 'hotp'

export interface AccountInStorage {
    id: string
    name: string
    secret: string
    type: AccountType
}

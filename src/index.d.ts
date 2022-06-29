export interface Account {
    id: string
    name: string
    secret: string
    code: string
    countdown: number
}

export type AccountType = 'time' | 'counter'

export interface AccountInStorage {
    id: string
    name: string
    secret: string
    type: AccountType
}

import type {Store} from "pinia"
import {computed} from 'vue'

export function useStoreProp<T extends Store, U extends keyof T>(
    store: T,
    prop: U,
) {
    return computed({
        get: () => store[prop],
        set: (val) => (store[prop] = val),
    })
}

import type { Store, StoreState } from "pinia"
import {computed} from 'vue'

export function useStorePropAsModel<T extends Store>(
  store: T,
  prop: keyof StoreState<T>,
) {
  return computed({
    get: () => store[prop as keyof T],
    set: (val) => (store[prop as keyof T] = val),
  })
}

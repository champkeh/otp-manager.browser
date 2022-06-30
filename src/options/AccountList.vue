<template>
  <h2>账户列表</h2>
  <ul>
    <li v-for="account in accountStore.accounts" :key="account.id">
      <div class="account">
        {{ account.name }}
        <button class="text" @click="onRemove(account.id)">删除</button>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import {useAccountStore} from '@/stores/AccountStore'

const accountStore = useAccountStore()
accountStore.init()

/**
 * 删除账户
 */
async function onRemove(id: string) {
  await accountStore.remove(id)
}
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}
ul {
  font-size: 18px;
}
button.text {
  color: blueviolet;
  background-color: transparent;
}
</style>

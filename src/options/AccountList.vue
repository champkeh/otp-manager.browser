<template>
  <h2>账户列表</h2>
  <ul>
    <li v-for="account in accountStore.accounts" :key="account.id">
      <div class="account">
        {{ account.name }}
        <button class="text" @click="onRemove(account)">删除</button>
      </div>
    </li>
  </ul>
  <div class="flex-start">
    <button class="btn" @click="accountStore.importAccount()">导入</button>
    <button class="btn" @click="accountStore.exportAccount()" :disabled="accountStore.accounts.length === 0">导出</button>
  </div>
</template>

<script lang="ts" setup>
import {useAccountStore} from '@/stores/AccountStore'
import {AccountInStorage} from "@/index";

const accountStore = useAccountStore()
accountStore.init()

/**
 * 删除账户
 */
async function onRemove(account: AccountInStorage) {
  const answer = prompt('请输入账户名确认删除')
  if (answer === account.name) {
    await accountStore.remove(account.id)
  } else if (answer !== null) {
    setTimeout(() => {
      onRemove(account)
    }, 0)
  }
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
.account {
  display: flex;
  align-items: flex-end;
  height: 30px;

  &:hover {
    button.text {
      display: initial;
    }
  }
}
button.text {
  display: none;
  color: blueviolet;
  background-color: transparent;
  margin-left: 10px;
}

button.btn {
  margin: 5px 10px;
  padding: .5em 1.2em;
  background-color: #eaeaea;
  color: blueviolet;
  border-radius: 3px;
  font-size: 16px;
  border: 1px solid transparent;
  transition: all .3s;

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:not([disabled]):focus {
    border: 1px solid -webkit-focus-ring-color;
  }

  &:not([disabled]):hover {
    color: white;
    background-color: blueviolet;
  }
}
</style>

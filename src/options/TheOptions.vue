<template>
  <h1>账户管理</h1>
  <ul>
    <li v-for="account in accounts" :key="account.id">
      <div class="account">
        {{ account.name }}
        <button class="text" @click="onRemove(account.id)">删除</button>
      </div>
    </li>
  </ul>
  <form @submit.prevent="onAdd">
    <p class="flex-row">
      <label for="account">账户:</label>
      <input class="flex-1" id="account" type="text" v-model="name" placeholder="请输入账号" required autocomplete="off">
    </p>
    <p class="flex-row">
      <label for="secret">密钥:</label>
      <input class="flex-1" id="secret" type="text" v-model="secret" placeholder="请输入密钥" required autocomplete="off">
    </p>
    <div class="flex-row">
      <select v-model="type">
        <option value="time">基于时间</option>
        <option value="counter">基于计数器</option>
      </select>
      <div>
        <button class="btn" @click.prevent="inspectStorage">检查storage</button>
        <button class="btn" @click.prevent="loadQRCode">二维码</button>
        <button class="btn">添加</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {v4 as uuid} from 'uuid'
import {genCode} from '@/utils/totp'
import {AccountInStorage, AccountType} from '@/index'

const name = ref('')
const secret = ref('')
const type = ref<AccountType>('time')
const accounts = ref<AccountInStorage[]>([])
chrome.storage.sync.get('accounts', (data) => {
  accounts.value = data.accounts || []
})

/**
 * 新增账户
 */
async function onAdd() {
  try {
    genCode(secret.value)
  } catch (e) {
    alert(`密钥 "${secret.value}" 无效`)
    return
  }

  accounts.value.push({
    id: uuid(),
    name: name.value,
    secret: secret.value,
    type: type.value,
  })
  await sync(accounts._rawValue as AccountInStorage[])
  name.value = ''
  secret.value = ''
  type.value = 'time'
}

/**
 * 删除账户
 */
async function onRemove(id: string) {
  accounts.value = accounts.value.filter(account => account.id !== id)
  await sync(accounts._rawValue)
}

/**
 * 同步storage
 */
async function sync(accounts: AccountInStorage[]) {
  await chrome.storage.sync.set({accounts})
}

/**
 * 检查storage
 */
async function inspectStorage() {
  const value = await chrome.storage.sync.get()
  console.log(value)
}

/**
 * 加载二维码
 */
function loadQRCode() {
  // todo
}

</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
  margin-bottom: 30px;
}

label {
  font-size: 18px;
  margin-right: 30px;
}

input {
  font-size: 18px;
  padding: 10px;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.flex-1 {
  flex: 1;
}

form {
  margin-top: 30px;
}

button.text {
  color: blueviolet;
  background-color: transparent;
}

button.btn {
  padding: 10px 20px;
  background-color: #eaeaea;
  color: blueviolet;
  border-radius: 3px;
  font-size: 18px;
  border: 1px solid transparent;
  margin-left: 10px;
  transition: all .3s;

  &:focus {
    border: 1px solid -webkit-focus-ring-color;
  }

  &:hover {
    color: white;
    background-color: blueviolet;
  }
}

select {
  color: blueviolet;
  padding: .75em;
}

ul {
  font-size: 18px;
}
</style>

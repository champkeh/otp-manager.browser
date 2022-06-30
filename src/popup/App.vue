<template>
  <h1>Authenticator</h1>
  <ul v-if="enabled">
    <li class="item" :class="{warning: account.countdown <= 3}" v-for="account in accounts" :key="account.id">
      <div>
        <p class="account">{{ account.name }}</p>
        <p class="code">{{ account.code }}</p>
      </div>
      <div v-if="account.countdown !== null" class="timer">{{ account.countdown }}s</div>
    </li>
    <li class="empty" v-if="accounts.length === 0">暂无账户~</li>
  </ul>
  <form v-else class="login">
    <p>请输入密码进行访问:</p>
    <input type="password" v-focus v-model="password" autocomplete="off" required>
  </form>
  <button v-if="enabled" class="add" @click="gotoOptionsPage">+</button>
</template>

<script lang="ts" setup>
import {ref, computed, watch, nextTick} from 'vue'
import {genCode} from '@/utils/totp'
import vFocus from '@/directives/vFocus'
import {Account, AccountInStorage} from '@/index'
import {useSettingStore} from '@/stores/SettingStore'
import {useAccountStore} from '@/stores/AccountStore'

const password = ref('')

const settingStore = useSettingStore()
settingStore.init()

const enabled = computed(() => {
  return !settingStore.enableProtect || settingStore.password === password.value
})
watch(enabled, (value) => {
  if (value) {
    nextTick(() => {
      enable()
    })
  }
}, {
  immediate: true
})

const accounts = ref<Account[]>([])

function countdown() {
  return 30 - Math.floor(Date.now() / 1000 % 30)
}

function formatCode(code: string): string {
  if (!code || code.length !== 6) {
    return code
  }
  return code.slice(0, 3) + ' ' + code.slice(3)
}

/**
 * 刷新code
 */
function refreshCode() {
  const c = countdown()
  accounts.value.forEach(account => {
    account.code = formatCode(genCode(account.secret))
    account.countdown = c
  })
}

const accountStore = useAccountStore()


/**
 * 启用
 */
async function enable() {
  await accountStore.init()
  accounts.value = accountStore.accounts.map((a: AccountInStorage) => ({
    code: '',
    countdown: 0,
    ...a,
  }))

  refreshCode()
  setInterval(() => {
    const c = countdown()

    accounts.value.forEach(a => a.countdown = c)

    if (c === 30) {
      refreshCode()
    }
  }, 1000)
}

function gotoOptionsPage() {
  window.location.href = chrome.runtime.getURL('/src/options/entry.html')
}
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
  margin-bottom: 30px;
}

@font-face {
  font-family: 'Space';
  src: local('Times New Roman');
  unicode-range: U+20;
}

.item {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 30px;

  .account {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .code {
    font-size: 34px;
    font-family: Space, Monaco, serif;
  }

  .timer {
    font-size: 24px;
  }

  &.warning {
    .code {
      color: red;
      transition: color .3s;
    }
  }
}

.empty {
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 18px;
}

button.add {
  position: fixed;
  top: 15px;
  right: 20px;
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  line-height: 30px;
  transition: all .3s;
  color: black;
  background-color: #eaeaea;

  &:hover {
    color: white;
    background-color: blueviolet;
    box-shadow: 0 0 20px 5px #eaeaea;
    transform: rotateZ(45deg);
  }
}

.login {
  p {
    font-size: 18px;
    margin-bottom: 10px;
  }

  input {
    font-size: 24px;
    padding: 3px 8px;
  }
}
</style>

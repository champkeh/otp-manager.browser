<template>
  <h1>OTP Manager</h1>
  <ul v-if="enabled">
    <li class="item" :class="{warning: account.countdown <= 3}" v-for="account in accounts" :key="account.id">
      <div>
        <p class="account">{{ account.name }}</p>
        <p>
          <span class="code">{{ account.code }}</span>
          <i v-if="account.copy" class="icon pointer ml10 ri-clipboard-fill" @click="copy(account)"></i>
          <i v-else class="icon green ml10 ri-check-fill"></i>
        </p>
      </div>
      <div v-if="account.countdown !== null" class="timer">{{ account.countdown }}s</div>
    </li>
    <li class="empty" v-if="accounts.length === 0">暂无账户~</li>
  </ul>
  <form v-else class="login">
    <p>请输入密码进行访问:</p>
    <input type="password" v-focus v-model="password" autocomplete="off" required>
  </form>
  <button v-if="enabled" class="setting" @click="gotoOptionsPage">
    <i class="icon pointer ri-settings-5-fill"></i>
  </button>
</template>

<script lang="ts" setup>
import {ref, computed, watch, nextTick} from 'vue'
import {genCode} from '@/utils/totp'
import vFocus from '@/directives/vFocus'
import {Account, AccountInStorage} from '@/index'
import {useSettingStore} from '@/stores/SettingStore'
import {useAccountStore} from '@/stores/AccountStore'
import {copy2Clipboard} from '@/utils/copy'

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
    copy: true,
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

function copy(account: Account) {
  copy2Clipboard(account.code.replace(/\s/g, ''))
  account.copy = false
  setTimeout(() => {
    account.copy = true
  }, 1000)
}
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
  margin-bottom: 30px;
}
i.icon {
  font-size: 20px;
}
.ml10 {
  margin-left: 10px;
}
.pointer {
  cursor: pointer;
}
.green {
  color: green;
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

button.setting {
  position: fixed;
  top: 15px;
  right: 20px;
  font-size: 20px;
  transition: all .3s;
  display: inline-flex;
  background-color: transparent;
  &:hover {
    transform: rotateZ(45deg);
  }

  i {
    font-size: 24px;
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

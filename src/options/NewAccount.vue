<template>
  <form @submit.prevent="onAdd">
    <p class="flex-row">
      <label for="account">账户:</label>
      <input class="flex-1" id="account" type="text" v-focus v-model="name" placeholder="请输入账号" required
             autocomplete="off">
    </p>
    <p class="flex-row">
      <label for="secret">密钥:</label>
      <input class="flex-1" id="secret" type="text" v-model="secret" placeholder="请输入密钥" required autocomplete="off">
    </p>
    <div class="flex-row">
      <select v-model="type">
        <option value="totp">基于时间</option>
        <option value="hotp">基于计数器</option>
      </select>
      <div>
<!--        <button class="btn" @click.prevent="inspectStorage">检查storage</button>-->
        <button class="btn" @click.prevent="loadQRCode">二维码</button>
        <button class="btn">添加</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import vFocus from '@/directives/vFocus'
import {useAccountStore} from '@/stores/AccountStore'
import {ref} from "vue"
import {AccountType} from "@/index"
import {decodeQrCodeLocal, parseSchema} from '@/utils/qrcode'

const accountStore = useAccountStore()

const name = ref('')
const secret = ref('')
const type = ref<AccountType>('totp')

/**
 * 新增账户
 */
async function onAdd() {
  accountStore.add(name.value, secret.value, type.value).then(() => {
    name.value = ''
    secret.value = ''
    type.value = 'totp'
  }).catch(e => {
    alert(e.message)
  })
}
/**
 * 检查storage
 */
async function inspectStorage() {
  const value = await chrome.storage.sync.get()
  console.log(value)
}

let fileEl: HTMLInputElement | null = null

/**
 * 加载二维码
 */
function loadQRCode() {
  if (!fileEl) {
    fileEl = document.createElement('input')
    fileEl.type = 'file'
    fileEl.accept = 'image/*'
    fileEl.style.visibility = 'hidden'
    fileEl.style.width = '0'
    fileEl.style.height = '0'
    document.body.appendChild(fileEl)
    fileEl.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files![0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = (evt) => {
          decodeQrCodeLocal(evt.target!.result as string).then(parseSchema).then(res => {
            if (res) {
              name.value = res.account
              secret.value = res.secret!
              type.value = res.type
            }
          }).catch(e => {
            alert(e.message)
          })
        }
        reader.readAsDataURL(file)
      }
    })
  }

  fileEl.click()
}

</script>

<style lang="scss" scoped>
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
</style>

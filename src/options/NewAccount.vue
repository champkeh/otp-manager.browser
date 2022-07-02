<template>
  <h2>添加账户</h2>
  <form @submit.prevent="onAdd">
    <p class="flex-row">
      <label for="account">账户:</label>
      <input class="flex-1" id="account" type="text" v-focus v-model="name" placeholder="请输入账户名" required
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
        <button class="btn">添加</button>
      </div>
    </div>
  </form>
  <div class="divider"><span>OR</span></div>
  <form @submit.prevent="fetchQRCode">
    <p class="flex-row">
      <input class="flex-1 font-sm" id="qrcode" type="url" v-select v-model="url" placeholder="二维码图片地址 (支持DataURL)" required autocomplete="off">
      <button class="btn" :disabled="loading">提取在线二维码</button>
      <button class="btn" @click.prevent="loadQRCode">本地二维码</button>
    </p>
  </form>
</template>

<script lang="ts" setup>
import vFocus from '@/directives/vFocus'
import vSelect from '@/directives/vSelect'
import {useAccountStore} from '@/stores/AccountStore'
import {ref} from "vue"
import {AccountType} from "@/index"
import {decodeQrCodeLocal, parseSchema} from '@/utils/qrcode'
import {download} from '@/utils/http'
import {readFileContent} from '@/utils/file'

const accountStore = useAccountStore()

const name = ref('')
const secret = ref('')
const type = ref<AccountType>('totp')
const url = ref('')

const loading = ref(false)

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


let fileEl: HTMLInputElement | null = null

/**
 * 加载本地二维码
 */
async function loadQRCode() {
  try {
    const dataURL = await readFileContent('image/*', 'DataURL')
    const schema = await decodeQrCodeLocal(dataURL as string).then(parseSchema)
    if (schema) {
      name.value = schema.account
      secret.value = schema.secret!
      type.value = schema.type
    }
  } catch (e: any) {
    alert(e.message)
  }
}

/**
 * 解析远程二维码
 */
function fetchQRCode() {
  loading.value = true
  let dataURLPromise: Promise<string>
  if (/data:image\/(png|jpeg);base64,.+/.test(url.value)) {
    dataURLPromise = Promise.resolve(url.value)
  } else {
    dataURLPromise = new Promise((resolve, reject) => {
      download(url.value).then(file => {
        const reader = new FileReader()
        reader.onloadend = (evt) => {
          resolve(evt.target!.result as string)
        }
        reader.readAsDataURL(file)
      })
    })
  }
  dataURLPromise.then(decodeQrCodeLocal).then(parseSchema).then(res => {
    if (res) {
      name.value = res.account
      secret.value = res.secret!
      type.value = res.type
    }
  }).catch(e => {
    alert(e.message)
  }).finally(() => {
    loading.value = false
  })
}

</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 24px;
  margin-top: 30px;
}
label {
  font-size: 18px;
  margin-right: 30px;
}

input {
  font-size: 16px;
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
.font-sm {
  font-size: 14px;
}
form {
  margin-top: 20px;
}

.divider {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  font-size: 20px;
  margin-bottom: 20px;

  &::before {
    position: absolute;
    content: "";
    width: 50%;
    height: 1px;
    background-color: blueviolet;
    display: block;
    left: 50%;
    transform: translateX(-50%);
    top: 10px;
  }

  span {
    padding: 0 20px;
    background-color: white;
    z-index: 10;
  }
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
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.3;
  }
}

select {
  color: blueviolet;
  padding: .75em;
  font-size: 16px;
}
</style>

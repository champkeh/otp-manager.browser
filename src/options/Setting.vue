<template>
  <h2>其他设置</h2>
  <form @submit.prevent="save">
    <div class="flex-row">
      <label>
        <input type="checkbox" v-model="enableProtect">
        密码保护
      </label>
      <div v-show="enableProtect" class="input-wrapper">
        <input v-model="password" :type="passwordType" placeholder="请输入密码">
        <i v-if="passwordType === 'password'" class="icon pointer ri-eye-line" @click="passwordType = 'text'"></i>
        <i v-else class="icon pointer ri-eye-close-line" @click="passwordType = 'password'"></i>
      </div>
    </div>
    <div class="flex-center">
      <button class="btn">保存设置</button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import {useSettingStore} from '@/stores/SettingStore'
import {useStoreProp} from '@/utils/useStoreProp'

const settingStore = useSettingStore()
settingStore.init()

const enableProtect = useStoreProp(settingStore, 'enableProtect')
const password = useStoreProp(settingStore, 'password')


function save() {
  settingStore.sync().then(() => {
    alert('保存成功')
  })
}

const passwordType = ref('password')
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 24px;
  margin-top: 30px;
}

form {
  label {
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-right: 20px;

    input[type=checkbox] {
      margin-right: 5px;
    }
  }

  .input-wrapper {
    position: relative;
    width: 200px;
  }

  input[type=text],
  input[type=password] {
    width: 100%;
    font-size: 18px;
  }

  .icon {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
  }
}

.pointer {
  cursor: pointer;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-row {
  display: flex;
  height: 40px;
  align-items: center;
}

button.btn {
  margin: 30px auto;
  padding: 10px 20px;
  background-color: #eaeaea;
  color: blueviolet;
  border-radius: 3px;
  font-size: 18px;
  border: 1px solid transparent;
  transition: all .3s;

  &:focus {
    border: 1px solid -webkit-focus-ring-color;
  }

  &:hover {
    color: white;
    background-color: blueviolet;
  }
}
</style>

<template>
<h2>其他设置</h2>
  <form @submit.prevent="save">
    <p class="flex-row">
      <label>
        <input type="checkbox" v-model="enableProtect">
        密码保护
      </label>
      <input v-show="enableProtect" v-model="password" type="password" placeholder="请输入密码">
    </p>
    <div class="flex-center">
      <button class="btn">保存设置</button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/stores/SettingStore'
import { useStorePropAsModel } from '@/utils/useStoreProp'

const settingStore = useSettingStore()
settingStore.init()

const enableProtect = useStorePropAsModel(settingStore, 'enableProtect')
const password = useStorePropAsModel(settingStore, 'password')

function save() {
  settingStore.sync().then(() => {
    alert('保存成功')
  })
}
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}
form {
  label {
    font-size: 18px;
  }
  input[type=password] {
    font-size: 18px;
    margin-left: 20px;
  }
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

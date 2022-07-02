<template>
  <h2>其他设置</h2>
  <form @submit.prevent>
    <div class="flex-row">
      <label>
        <input type="checkbox" v-model="settingStore.enableProtect">
        开启密码保护
      </label>
      <div v-show="settingStore.enableProtect" class="input-wrapper">
        <input v-model="settingStore.password" :type="passwordType" placeholder="请输入密码">
        <i v-if="passwordType === 'password'" class="icon pointer ri-eye-line" @click="passwordType = 'text'"></i>
        <i v-else class="icon pointer ri-eye-close-line" @click="passwordType = 'password'"></i>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import {useSettingStore} from '@/stores/SettingStore'

const settingStore = useSettingStore()
settingStore.init()

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
.flex-start {
  display: flex;
}

.flex-row {
  display: flex;
  height: 40px;
  align-items: center;
}

button.btn {
  margin: 10px 20px;
  padding: 10px 20px;
  background-color: #eaeaea;
  color: blueviolet;
  border-radius: 3px;
  font-size: 18px;
  border: 1px solid transparent;
  transition: all .3s;

  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }

  &:focus {
    border: 1px solid -webkit-focus-ring-color;
  }

  &:hover {
    color: white;
    background-color: blueviolet;
  }
}
</style>

<template>
  <h2>编辑账户</h2>
  <form @submit.prevent="onEdit">
    <p class="flex-row">
      <label for="account">账户:</label>
      <input class="flex-1" id="account" type="text" v-focus v-model="name" placeholder="请输入账户名" required
             autocomplete="off">
    </p>
    <p class="flex-row">
      <label for="secret">密钥:</label>
      <input class="flex-1" id="secret" type="text" :value="secret" disabled placeholder="请输入密钥" required
             autocomplete="off">
    </p>
    <p class="flex-row">
      <label for="group">分组:</label>
      <input class="flex-1" id="group" type="text" v-model="group" placeholder="请输入分组名" required
             autocomplete="off">
    </p>
    <div class="flex-row">
      <select :value="type" disabled>
        <option value="totp">基于时间</option>
        <option value="hotp">基于计数器</option>
      </select>
      <div>
        <button class="btn">更新</button>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import {useAccountStore} from '@/stores/AccountStore'
import vFocus from '@/directives/vFocus'
import {ref, watch} from 'vue'

const accountStore = useAccountStore()
const currentAccount = accountStore.current!

const name = ref(currentAccount.name)
const secret = ref(currentAccount.secret)
const group = ref(currentAccount.group)
const type = ref(currentAccount.type)
const id = ref(currentAccount.id)

watch(() => accountStore.current, (value) => {
  id.value = value?.id!
  name.value = value?.name!
  secret.value = value?.secret!
  group.value = value?.group!
  type.value = value?.type!
})

function onEdit() {
  accountStore.update({
    id: id.value,
    name: name.value,
    secret: secret.value,
    group: group.value,
    type: type.value,
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

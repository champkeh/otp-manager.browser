<template>
  <li class="item" :class="{warning: account.countdown <= 4}">
    <div>
      <p class="flex-justify">
        <span class="account">{{ account.name }}</span>
        <span class="group">{{account.group}}</span>
      </p>
      <p>
        <span class="code">{{ account.code }}</span>

        <!--小于3秒的时候不可拷贝-->
        <template v-if="account.countdown > 3">
          <i v-if="account.copy" class="icon pointer ml10 ri-clipboard-fill" @click="copy(account)"></i>
          <i v-else class="icon green ml10 ri-check-fill"></i>
        </template>
      </p>
    </div>
    <div v-if="account.countdown !== null" class="timer">{{ account.countdown }}s</div>
  </li>
</template>

<script lang="ts" setup>
import {Account} from '@/index'
import {copy2Clipboard} from "@/utils/copy"

const props = defineProps<{
  account: Account
}>()
const account = props.account

function copy(account: Account) {
  copy2Clipboard(account.code.replace(/\s/g, ''))
  account.copy = false
  setTimeout(() => {
    account.copy = true
  }, 1000)
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'Space';
  src: local('Times New Roman');
  unicode-range: U+20;
}
@keyframes blink {
  30% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  80% {
    opacity: 1;
  }
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
.item {
  position: relative;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 30px;

  .account {
    font-size: 18px;
    margin-bottom: 10px;
    color: #484747;
  }
  .group {
    font-size: 16px;
    color: blueviolet;
  }

  .code {
    font-size: 34px;
    font-family: Space, Monaco, serif;
  }

  .timer {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 24px;
  }

  &.warning {
    .code {
      color: red;
      animation-duration: 1s;
      animation-delay: 0.5s;
      animation-name: blink;
      animation-iteration-count: infinite;
    }
  }
}

.flex-justify {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>

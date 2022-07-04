<template>
  <AccountList/>
  <NewAccount v-if="accountStore.mode === 'add'"/>
  <EditAccount v-else-if="accountStore.mode === 'edit'" />
  <Setting/>
</template>

<script lang="ts" setup>
import AccountList from "@/options/AccountList.vue"
import NewAccount from "@/options/NewAccount.vue"
import EditAccount from "@/options/EditAccount.vue"
import Setting from "@/options/Setting.vue"
import {useAccountStore} from '@/stores/AccountStore'

const accountStore = useAccountStore()

</script>

<style lang="scss" scoped>
</style>

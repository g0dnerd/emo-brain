<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Login from './Login.vue'
import Playback from './Playback.vue'
import Playlists from './Playlists.vue'

const loading = ref(false)
const token = ref(null)

watchEffect(async () => {
  loading.value = true

  try {
    const res = await fetch('http://127.0.0.1:5000/auth/token')
    const json = await res.json()
    token.value = json.access_token
  } catch (err) {
    console.error(err)
    token.value = null
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <p v-if="loading">Loading...</p>
  <div v-else class="wrapper">
    <div class="wrapper-inner">
      <Playback v-if="token" :token="token" />
      <Login v-else />
    </div>
    <div class="wrapper-inner">
      <Playlists v-if="token" :token="token" />
      <Login v-else />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.wrapper
  display: flex;
  flex-flow: row;

.wrapper-inner
  padding: 40px 60px;
</style>

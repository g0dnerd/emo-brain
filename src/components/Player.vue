<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Login from './Login.vue'
import Playback from './Playback.vue'
import Playlists from './Playlists.vue'

const loading = ref(false)
const token = ref<string>()

watchEffect(async () => {
  loading.value = true

  try {
    // Fetch the current access token from the backend server
    const res = await fetch('http://127.0.0.1:5000/auth/token')
    const json = await res.json()
    token.value = json.access_token
  } catch (err) {
    console.error(err)
    token.value = undefined
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <p v-if="loading">Loading...</p>
  <div v-else>
    <div v-if="token" class="wrapper">
      <Playback :token="token" />
      <Playlists :token="token" />
    </div>
    <Login v-else />
  </div>
</template>

<style lang="sass" scoped>
.wrapper
  display: flex;
  flex-direction: row;
  justify-content: space-around;
</style>

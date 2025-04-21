<script setup lang="ts">
const { token } = defineProps(['token'])

import { ref, watchEffect } from 'vue'

const loading = ref(false)
const player = ref(null)

watchEffect(() => {
  loading.value = true
  try {
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true

    document.body.appendChild(script)

    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('SDK ready')

      // @ts-ignore
      const p = new window.Spotify.Player({
        name: 'Web Playback SDK',
        // @ts-ignore
        getOAuthToken: (cb) => {
          cb(token)
        },
        volume: 0.5,
      })

      player.value = p

      p.addListener('ready', (device_id: string) => {
        console.log('Ready with device ID', device_id)
      })

      p.addListener('not_ready', (device_id: string) => {
        console.log('Device ID has gone offline:', device_id)
      })

      // @ts-ignore
      p.connect()
    }
  } catch {
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container">
    <div class="main-wrapper"></div>
  </div>
</template>

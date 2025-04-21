<script setup lang="ts">
const { token } = defineProps(['token'])

import { ref, watchEffect } from 'vue'
import { type WebPlaybackTrack, type WebPlaybackState } from '@/types'

const loading = ref(false)

const webPlayer = ref()
const isPaused = ref(false)
const isActive = ref(false)
const currentTrack = ref<WebPlaybackTrack>()
const deviceId = ref<string>()

watchEffect(async () => {
  loading.value = true
  try {
    // Load the Spotify web playback SDK script and embed it
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    document.body.appendChild(script)

    // Use the Spotify SDK to create a hook into the playback API
    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = () => {
      // @ts-ignore
      const player = new window.Spotify.Player({
        name: 'Elele',
        getOAuthToken: (callback: any) => {
          callback(token)
        },
        volume: 0.5,
      })

      webPlayer.value = player

      // TODO: Is there anything the client needs to do here?
      player.addListener('ready', (device_id: string) => {
        deviceId.value = device_id
        console.log('Ready with device ID', device_id)
      })

      // TODO: Is there anything the client needs to do here?
      player.addListener('not_ready', (device_id: string) => {
        deviceId.value = undefined
        console.log('Device ID has gone offline:', device_id)
      })

      player.addListener('player_state_changed', (state: WebPlaybackState) => {
        if (!state) {
          return
        }

        currentTrack.value = state.track_window.current_track
        isPaused.value = state.paused

        player.getCurrentState().then((state: WebPlaybackState) => {
          !state ? (isActive.value = false) : (isActive.value = true)
        })
      })

      // @ts-ignore
      player.connect()
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

function previousTrack() {
  webPlayer.value.previousTrack()
}

function togglePlay() {
  webPlayer.value.togglePlay()
}

function nextTrack() {
  webPlayer.value.nextTrack()
}
</script>

<template>
  <div class="container">
    <div v-if="loading">Loading...</div>
    <div v-else class="main-wrapper">
      <div v-if="currentTrack" class="now-playing">
        <img v-bind:src="currentTrack.album.images[0].url" class="now-playing__cover" alt="" />
        <div class="now-playing__side">
          <div class="now-playing__name">{{ currentTrack.name }}</div>
        </div>
        <div class="now-playing__artist">{{ currentTrack.artists[0].name }}</div>

        <button className="btn-spotify" @click="previousTrack()">&lt;&lt;</button>

        <button className="btn-spotify" @click="togglePlay()">
          {{ isPaused ? 'PLAY' : 'PAUSE' }}
        </button>

        <button className="btn-spotify" @click="nextTrack()">&gt;&gt;</button>
      </div>
      <p v-else>Waiting for playback</p>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.now-playing__cover
  max-width: 400px;
</style>

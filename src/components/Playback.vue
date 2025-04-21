<script setup lang="ts">
const { token } = defineProps(['token'])

import { ref, watchEffect } from 'vue'
import { type Track } from '@/types'

const loading = ref(false)

const player = ref()
const isPaused = ref(false)
const isActive = ref(false)
const currentTrack = ref<Track>()

watchEffect(async () => {
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
        name: 'Elele',
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

      p.addListener('player_state_changed', (state: any) => {
        if (!state) {
          return
        }

        currentTrack.value = state.track_window.current_track
        isPaused.value = state.paused

        // @ts-ignore
        p.getCurrentState().then((state: any) => {
          !state ? (isActive.value = false) : (isActive.value = true)
        })
      })

      // @ts-ignore
      p.connect()
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

function previousTrack() {
  player.value.previousTrack()
}

function togglePlay() {
  player.value.togglePlay()
}

function nextTrack() {
  player.value.nextTrack()
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

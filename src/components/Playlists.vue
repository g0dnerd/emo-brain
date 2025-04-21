<script setup lang="ts">
const { token } = defineProps(['token'])

import { ref, watchEffect } from 'vue'
import type { PlaylistResponse, SimplifiedPlaylist } from '@/types'

const playlists = ref<SimplifiedPlaylist[]>()

watchEffect(async () => {
  // Fetch playlists for the currently authenticated user from backend
  const res = await fetch('http://127.0.0.1:5000/api/playlists', {
    method: 'GET',
    // TODO: Make this some sort of interceptor
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  const playlistsJson: PlaylistResponse = await res.json()
  playlists.value = playlistsJson.items

  const deviceRes = await fetch('http://127.0.0.1:5000/api/devices', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  console.log('Devices:', deviceRes.json())
})
</script>

<template>
  <div class="wrapper-inner">
    <h3>Playlists:</h3>
    <ul class="list__playlists">
      <li v-for="playlist in playlists">
        {{ playlist.name }} ({{ playlist.tracks.total }} tracks)
      </li>
    </ul>
  </div>
</template>

<style lang="sass" scoped>
.list__playlists
  list-style-type: none;
</style>

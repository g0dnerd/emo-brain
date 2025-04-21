<script setup lang="ts">
const { token } = defineProps(['token'])

import { ref, watchEffect } from 'vue'
import type { PlaylistResponse, SimplifiedPlaylist } from '@/types'

const playlists = ref<SimplifiedPlaylist[]>()

watchEffect(async () => {
  const res = await fetch('http://127.0.0.1:5000/api/playlists', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
  const playlistsRes: PlaylistResponse = await res.json()
  playlists.value = playlistsRes.items
})
</script>

<template>
  <h3>Playlists:</h3>
  <ul class="list__playlists">
    <li v-for="playlist in playlists">{{ playlist.name }} ({{ playlist.tracks.total }} tracks)</li>
  </ul>
</template>

<style lang="sass" scoped>
.list__playlists
  list-style-type: none;
</style>

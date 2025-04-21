<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Login from './Login.vue'

const loading = ref(false)
const token = ref(null)
const error = ref(null)

const route = useRoute()

watch(() => route.params.id, fetchData, { immediate: true })

async function fetchData() {
  error.value = token.value = null
  loading.value = true

  try {
    const res = await fetch('http://127.0.0.1:5000/auth/token')
    console.log(`Response: ${JSON.stringify(res)}`)
    const json = await res.json()
    token.value = json.access_token
  } catch (err) {
    console.error(err)
    token.value = null
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="wrapper">
    <p v-if="token">Das ja jetzt cringe Bruder</p>
    <Login v-else />
  </div>
</template>

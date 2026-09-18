<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "./stores/authStore"

const router = useRouter()
const authStore = useAuthStore()

/**
 * Handles browser bfcache (Back-Forward Cache) and navigation restores seamlessly
 */
const handlePageShow = () => {
  authStore.syncState()
  const currentRoute = router.currentRoute.value
  const isAuthenticated = authStore.isAuthenticated()

  if (isAuthenticated && currentRoute.meta.requiresGuest) {
    router.replace({ name: "payment-methods" })
  } else if (!isAuthenticated && currentRoute.meta.requiresAuth) {
    router.replace({ name: "login" })
  }
}

onMounted(() => {
  window.addEventListener("pageshow", handlePageShow)
})

onUnmounted(() => {
  window.removeEventListener("pageshow", handlePageShow)
})
</script>

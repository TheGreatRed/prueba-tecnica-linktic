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
 * Handles browser bfcache (Back-Forward Cache) restores seamlessly
 */
const handlePageShow = (event: PageTransitionEvent) => {
  if (event.persisted) {
    const currentRoute = router.currentRoute.value
    if (authStore.isAuthenticated() && currentRoute.meta.requiresGuest) {
      router.replace({ name: "payment-methods" })
    }
  }
}

onMounted(() => {
  window.addEventListener("pageshow", handlePageShow)
})

onUnmounted(() => {
  window.removeEventListener("pageshow", handlePageShow)
})
</script>

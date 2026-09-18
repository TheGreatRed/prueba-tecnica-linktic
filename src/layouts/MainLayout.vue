<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          LinkTic - Administración
        </q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="logout"
          :disable="authStore.isLoading || paymentStore.isLoading"
          @click="handleLogout"
        >
          <q-tooltip>Cerrar Sesión</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/authStore"
import { usePaymentStore } from "../stores/paymentStore"
import { Dialog } from "quasar"

const router = useRouter()
const authStore = useAuthStore()
const paymentStore = usePaymentStore()

/**
 * Prevents accidental tab close or page reload while async requests are active
 */
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (paymentStore.isLoading || authStore.isLoading) {
    e.preventDefault()
    e.returnValue = ""
    return ""
  }
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload)
})

/**
 * Prompts confirmation dialog and logs out user if confirmed
 */
const handleLogout = () => {
  Dialog.create({
    title: "Cerrar Sesión",
    message: `
      <div class="row items-center no-wrap q-pt-xs">
        <div class="q-avatar bg-negative text-white q-mr-md" style="width: 44px; height: 44px; min-width: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <i class="material-icons" style="font-size: 24px;">logout</i>
        </div>
        <div class="text-body1 text-grey-9 text-weight-medium">
          ¿Estás seguro de que deseas salir del sistema?
        </div>
      </div>
    `,
    html: true,
    cancel: {
      label: "Cancelar",
      flat: true,
      color: "grey-8"
    },
    ok: {
      label: "Cerrar Sesión",
      color: "negative",
      unelevated: true
    },
    persistent: true
  }).onOk(() => {
    authStore.logout()
    router.replace({ name: "login" })
  })
}
</script>

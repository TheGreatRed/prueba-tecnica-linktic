<template>
  <div class="fullscreen bg-blue-1 text-primary text-center q-pa-md flex flex-center">
    <div class="column items-center">
      <div style="font-size: 8rem; line-height: 1; font-weight: 800;" class="text-primary opacity-80">
        404
      </div>

      <div class="text-h4 text-weight-bold text-grey-9 q-mt-md q-mb-xs">
        Página no encontrada
      </div>

      <p class="text-body1 text-grey-7 q-mb-lg" style="max-width: 480px;">
        La página que estás buscando no existe, ha sido movida o la dirección ingresada es incorrecta.
      </p>

      <q-btn
        unelevated
        color="primary"
        size="md"
        :icon="authStore.isAuthenticated() ? 'dashboard' : 'login'"
        :label="authStore.isAuthenticated() ? 'Ir al Panel Principal' : 'Ir a Iniciar Sesión'"
        :to="authStore.isAuthenticated() ? '/dashboard/payment-methods' : '/login'"
        class="q-px-lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/authStore"

const authStore = useAuthStore()
</script>

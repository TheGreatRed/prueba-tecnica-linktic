<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my-card" style="width: 400px; max-width: 90vw;">
          <q-card-section class="text-center">
            <div class="text-h5 text-weight-bold text-primary">LinkTic Test</div>
            <div class="text-subtitle2 text-grey-7">Iniciar Sesión</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="onSubmit" class="q-gutter-md">
              <q-input
                filled
                v-model="username"
                label="Usuario"
                :disable="authStore.isLoading"
                lazy-rules
                :rules="[val => val && val.length > 0 || 'Por favor ingresa tu usuario']"
              />

              <q-input
                filled
                :type="isPasswordVisible ? 'text' : 'password'"
                v-model="password"
                label="Contraseña"
                :disable="authStore.isLoading"
                lazy-rules
                :rules="[val => val && val.length > 0 || 'Por favor ingresa tu contraseña']"
              >
                <template #append>
                  <q-icon
                    :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPasswordVisible = !isPasswordVisible"
                  />
                </template>
              </q-input>

              <div class="text-caption text-grey text-center q-mt-sm">
                Credenciales de prueba: admin / admin123
              </div>

              <div>
                <q-btn
                  label="Iniciar Sesión"
                  type="submit"
                  color="primary"
                  class="full-width"
                  :loading="authStore.isLoading"
                  :disable="authStore.isLoading"
                  unelevated
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/authStore"

const router = useRouter()
const authStore = useAuthStore()

const username = ref("")
const password = ref("")
const isPasswordVisible = ref(false)

/**
 * Handle login form submission
 */
const onSubmit = async () => {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.replace({ name: "payment-methods" })
  }
}
</script>

<style scoped lang="scss">
.my-card {
  border-radius: 12px;
}
</style>

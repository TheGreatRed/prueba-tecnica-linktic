import { defineStore } from "pinia"
import { ref } from "vue"
import { mockApi } from "../services/mockApi"
import type { User } from "../types"
import { Notify } from "quasar"

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(sessionStorage.getItem("authToken") || null)
  const isLoading = ref(false)

  const isAuthenticated = () => !!token.value

  /**
   * Realiza el proceso de login contra el servicio simulado
   */
  const login = async (username: string, password: string) => {
    isLoading.value = true
    try {
      const response = await mockApi.login(username, password)
      user.value = response.user
      token.value = response.token
      sessionStorage.setItem("authToken", response.token)
      Notify.create({ type: "positive", message: "Sesión iniciada correctamente" })
      return true
    } catch (error: any) {
      Notify.create({ type: "negative", message: error.message || "Error al iniciar sesión" })
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cierra la sesión activa
   */
  const logout = () => {
    user.value = null
    token.value = null
    sessionStorage.removeItem("authToken")
    Notify.create({ type: "info", message: "Sesión cerrada" })
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout
  }
})

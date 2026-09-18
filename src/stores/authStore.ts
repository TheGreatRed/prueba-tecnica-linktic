import { defineStore } from "pinia"
import { ref } from "vue"
import { mockApi } from "../services/mockApi"
import type { User } from "../types"
import { Notify } from "quasar"

export const useAuthStore = defineStore("auth", () => {
  const getInitialUser = (): User | null => {
    const storedUser = sessionStorage.getItem("authUser")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch {
        return null
      }
    }
    return null
  }

  const user = ref<User | null>(getInitialUser())
  const token = ref<string | null>(sessionStorage.getItem("authToken") || null)
  const isLoading = ref(false)

  /**
   * Sincroniza el estado reactivo en memoria con sessionStorage
   * para manejar de forma robusta la restauración desde la caché del navegador (bfcache)
   */
  const syncState = () => {
    const storedToken = sessionStorage.getItem("authToken")
    const storedUser = sessionStorage.getItem("authUser")

    if (token.value !== storedToken) {
      token.value = storedToken
    }

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        user.value = null
      }
    } else if (!storedToken) {
      user.value = null
    }

    return !!token.value
  }

  const isAuthenticated = () => {
    syncState()
    return !!token.value
  }

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
      sessionStorage.setItem("authUser", JSON.stringify(response.user))
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
    sessionStorage.removeItem("authUser")
    Notify.create({ type: "info", message: "Sesión cerrada" })
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    syncState,
    login,
    logout
  }
})

import { setActivePinia, createPinia } from "pinia"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { useAuthStore } from "../authStore"

vi.mock("quasar", () => ({
  Notify: {
    create: vi.fn()
  }
}))

vi.mock("../../services/mockApi", () => ({
  mockApi: {
    login: vi.fn().mockImplementation((username, password) => {
      if (username === "admin" && password === "admin123") {
        return Promise.resolve({
          user: { id: "1", name: "Administrador", username: "admin" },
          token: "mock-jwt-token-123"
        })
      }
      return Promise.reject(new Error("Credenciales inválidas"))
    })
  }
}))

describe("Auth Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it("inicializa sin autenticación si sessionStorage está vacío", () => {
    const store = useAuthStore()
    expect(store.isAuthenticated()).toBe(false)
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it("login exitoso guarda token y usuario en sessionStorage y actualiza el estado", async () => {
    const store = useAuthStore()
    const success = await store.login("admin", "admin123")

    expect(success).toBe(true)
    expect(store.isAuthenticated()).toBe(true)
    expect(store.token).toBe("mock-jwt-token-123")
    expect(sessionStorage.getItem("authToken")).toBe("mock-jwt-token-123")
    expect(JSON.parse(sessionStorage.getItem("authUser") || "{}")).toEqual({
      id: "1",
      name: "Administrador",
      username: "admin"
    })
  })

  it("login fallido no guarda datos ni autentica", async () => {
    const store = useAuthStore()
    const success = await store.login("wrong", "credentials")

    expect(success).toBe(false)
    expect(store.isAuthenticated()).toBe(false)
    expect(store.token).toBeNull()
  })

  it("logout limpia sessionStorage y resetea el estado", async () => {
    const store = useAuthStore()
    await store.login("admin", "admin123")
    expect(store.isAuthenticated()).toBe(true)

    store.logout()

    expect(store.isAuthenticated()).toBe(false)
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(sessionStorage.getItem("authToken")).toBeNull()
    expect(sessionStorage.getItem("authUser")).toBeNull()
  })

  it("syncState sincroniza la memoria con sessionStorage al restaurar desde bfcache", () => {
    const store = useAuthStore()
    expect(store.isAuthenticated()).toBe(false)

    // Simula que sessionStorage fue actualizado en otra pestaña o restaurado
    sessionStorage.setItem("authToken", "restored-token")
    sessionStorage.setItem("authUser", JSON.stringify({ id: "2", name: "User 2", username: "user2" }))

    const isAuth = store.syncState()

    expect(isAuth).toBe(true)
    expect(store.token).toBe("restored-token")
    expect(store.user?.username).toBe("user2")
    expect(store.isAuthenticated()).toBe(true)
  })
})

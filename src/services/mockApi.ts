import type { PaymentMethod, User } from "../types"

// Delay simulado para llamadas de red (ms)
const LATENCY = 800

const STORAGE_KEY = "linktic_payment_methods"

// Mock data inicial por defecto
const DEFAULT_METHODS: PaymentMethod[] = [
  { id: "1", name: "Visa terminada en 4242", type: "credit_card", isActive: true, createdAt: "2023-01-15T10:00:00Z" },
  { id: "2", name: "Mastercard Nómina", type: "debit_card", isActive: true, createdAt: "2023-02-20T14:30:00Z" },
  { id: "3", name: "Transferencia Bancolombia", type: "bank_transfer", isActive: false, createdAt: "2023-05-10T09:15:00Z", description: "Cuenta de ahorros" },
  { id: "4", name: "Nequi", type: "digital_wallet", isActive: true, createdAt: "2023-08-05T16:45:00Z" }
]

/**
 * Carga los métodos de pago desde localStorage con fallback al listado inicial
 */
const loadStoredMethods = (): PaymentMethod[] => {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        return JSON.parse(raw)
      }
    }
  } catch {
    // Fallback silencioso a valores iniciales
  }
  return [...DEFAULT_METHODS]
}

/**
 * Guarda los métodos de pago en localStorage
 */
const saveStoredMethods = (methods: PaymentMethod[]) => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(methods))
    }
  } catch {
    // Ignorar errores de almacenamiento en entornos no compatibles
  }
}

let mockPaymentMethods: PaymentMethod[] = loadStoredMethods()

/**
 * Simula una promesa asíncrona con delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Servicio centralizado para simulaciones (Mocks)
 * Implementa el patrón Singleton exportando el objeto
 */
export const mockApi = {
  /**
   * Simula un inicio de sesión
   */
  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    await delay(LATENCY)
    // Credenciales fijas para el mock
    if (username === "admin" && password === "admin123") {
      return {
        token: "mock-jwt-token-12345",
        user: { id: "u1", username: "admin", name: "Administrador LinkTic" }
      }
    }
    throw new Error("Credenciales inválidas")
  },

  /**
   * Obtiene la lista de métodos de pago
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await delay(LATENCY)
    mockPaymentMethods = loadStoredMethods()
    return [...mockPaymentMethods]
  },

  /**
   * Crea un nuevo método de pago
   */
  async createPaymentMethod(data: Omit<PaymentMethod, "id" | "createdAt" | "isActive">): Promise<PaymentMethod> {
    await delay(LATENCY)
    const newMethod: PaymentMethod = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      isActive: true
    }
    mockPaymentMethods.push(newMethod)
    saveStoredMethods(mockPaymentMethods)
    return newMethod
  },

  /**
   * Actualiza un método de pago existente
   */
  async updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    await delay(LATENCY)
    const index = mockPaymentMethods.findIndex(p => p.id === id)
    if (index === -1) throw new Error("Método de pago no encontrado")
    
    mockPaymentMethods[index] = { ...mockPaymentMethods[index], ...data }
    saveStoredMethods(mockPaymentMethods)
    return mockPaymentMethods[index]
  },

  /**
   * Elimina un método de pago
   */
  async deletePaymentMethod(id: string): Promise<void> {
    await delay(LATENCY)
    const initialLength = mockPaymentMethods.length
    mockPaymentMethods = mockPaymentMethods.filter(p => p.id !== id)
    if (mockPaymentMethods.length === initialLength) {
      throw new Error("No se pudo eliminar: Método de pago no encontrado")
    }
    saveStoredMethods(mockPaymentMethods)
  },

  /**
   * Restablece los datos a los valores iniciales de prueba
   */
  async resetToDefault(): Promise<PaymentMethod[]> {
    await delay(LATENCY)
    mockPaymentMethods = [...DEFAULT_METHODS]
    saveStoredMethods(mockPaymentMethods)
    return [...mockPaymentMethods]
  }
}

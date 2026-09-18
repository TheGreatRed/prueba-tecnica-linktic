import { setActivePinia, createPinia } from "pinia"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { usePaymentStore } from "../paymentStore"
import { mockApi } from "../../services/mockApi"

vi.mock("quasar", () => ({
  Notify: {
    create: vi.fn()
  }
}))

vi.mock("../../services/mockApi", () => ({
  mockApi: {
    getPaymentMethods: vi.fn().mockResolvedValue([
      { id: "1", name: "Test Card", type: "credit_card", isActive: true }
    ]),
    createPaymentMethod: vi.fn().mockResolvedValue(
      { id: "2", name: "New Card", type: "debit_card", isActive: true }
    ),
    updatePaymentMethod: vi.fn().mockResolvedValue(
      { id: "1", name: "Updated Card", type: "credit_card", isActive: false }
    ),
    deletePaymentMethod: vi.fn().mockResolvedValue(true),
    resetToDefault: vi.fn().mockResolvedValue([
      { id: "1", name: "Visa terminada en 4242", type: "credit_card", isActive: true },
      { id: "2", name: "Mastercard Nómina", type: "debit_card", isActive: true }
    ])
  }
}))

describe("Payment Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it("fetchPaymentMethods carga los datos simulados y llama al servicio", async () => {
    const store = usePaymentStore()
    expect(store.paymentMethods.length).toBe(0)

    await store.fetchPaymentMethods()

    expect(mockApi.getPaymentMethods).toHaveBeenCalledTimes(1)
    expect(store.paymentMethods.length).toBe(1)
    expect(store.paymentMethods[0].name).toBe("Test Card")
  })

  it("createMethod añade un nuevo elemento y envía los datos correctos", async () => {
    const store = usePaymentStore()
    const payload = { name: "New Card", type: "debit_card" as const }

    await store.createMethod(payload)

    expect(mockApi.createPaymentMethod).toHaveBeenCalledWith(payload)
    expect(store.paymentMethods.length).toBe(1)
    expect(store.paymentMethods[0].name).toBe("New Card")
  })

  it("updateMethod actualiza el registro en el store", async () => {
    const store = usePaymentStore()
    await store.fetchPaymentMethods()

    const updatePayload = { name: "Updated Card", isActive: false }
    await store.updateMethod("1", updatePayload)

    expect(mockApi.updatePaymentMethod).toHaveBeenCalledWith("1", updatePayload)
    expect(store.paymentMethods[0].name).toBe("Updated Card")
    expect(store.paymentMethods[0].isActive).toBe(false)
  })

  it("deleteMethod elimina el registro del store", async () => {
    const store = usePaymentStore()
    await store.fetchPaymentMethods()
    expect(store.paymentMethods.length).toBe(1)

    await store.deleteMethod("1")

    expect(mockApi.deletePaymentMethod).toHaveBeenCalledWith("1")
    expect(store.paymentMethods.length).toBe(0)
  })

  it("resetToDefault recarga los datos por defecto del mock", async () => {
    const store = usePaymentStore()
    expect(store.paymentMethods.length).toBe(0)

    await store.resetToDefault()

    expect(mockApi.resetToDefault).toHaveBeenCalledTimes(1)
    expect(store.paymentMethods.length).toBe(2)
    expect(store.paymentMethods[0].name).toBe("Visa terminada en 4242")
  })
})

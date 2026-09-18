import { defineStore } from "pinia"
import { ref } from "vue"
import { mockApi } from "../services/mockApi"
import type { PaymentMethod } from "../types"
import { Notify } from "quasar"

export const usePaymentStore = defineStore("payment", () => {
  const paymentMethods = ref<PaymentMethod[]>([])
  const isLoading = ref(false)

  /**
   * Carga el listado de métodos de pago
   */
  const fetchPaymentMethods = async () => {
    isLoading.value = true
    try {
      paymentMethods.value = await mockApi.getPaymentMethods()
    } catch (error: any) {
      Notify.create({ type: "negative", message: "Error al cargar los métodos de pago" })
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Crea un registro de método de pago
   */
  const createMethod = async (data: Omit<PaymentMethod, "id" | "createdAt" | "isActive">) => {
    isLoading.value = true
    try {
      const newMethod = await mockApi.createPaymentMethod(data)
      paymentMethods.value.push(newMethod)
      Notify.create({ type: "positive", message: "Método de pago creado con éxito" })
      return true
    } catch (error: any) {
      Notify.create({ type: "negative", message: "No se pudo crear el registro" })
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Edita un registro o actualiza su estado activo/inactivo
   */
  const updateMethod = async (id: string, data: Partial<PaymentMethod>) => {
    isLoading.value = true
    try {
      const updated = await mockApi.updatePaymentMethod(id, data)
      const index = paymentMethods.value.findIndex(p => p.id === id)
      if (index !== -1) {
        paymentMethods.value[index] = updated
      }

      if (data.isActive !== undefined && Object.keys(data).length === 1) {
        const statusLabel = updated.isActive ? "activado" : "desactivado"
        Notify.create({
          type: "positive",
          message: `Método de pago ${statusLabel} correctamente`
        })
      } else {
        Notify.create({ type: "positive", message: "Método de pago actualizado con éxito" })
      }
      return true
    } catch (error: any) {
      Notify.create({ type: "negative", message: "Error al actualizar el registro" })
      await fetchPaymentMethods()
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Elimina un método de pago
   */
  const deleteMethod = async (id: string) => {
    isLoading.value = true
    try {
      await mockApi.deletePaymentMethod(id)
      paymentMethods.value = paymentMethods.value.filter(p => p.id !== id)
      Notify.create({ type: "positive", message: "Método de pago eliminado correctamente" })
      return true
    } catch (error: any) {
      Notify.create({ type: "negative", message: "Error al eliminar el método de pago" })
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Restablece la lista a los datos iniciales de prueba
   */
  const resetToDefault = async () => {
    isLoading.value = true
    try {
      paymentMethods.value = await mockApi.resetToDefault()
      Notify.create({
        type: "positive",
        message: "Datos de prueba restablecidos correctamente"
      })
      return true
    } catch (error: any) {
      Notify.create({
        type: "negative",
        message: "Error al restablecer los datos de prueba"
      })
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    paymentMethods,
    isLoading,
    fetchPaymentMethods,
    createMethod,
    updateMethod,
    deleteMethod,
    resetToDefault
  }
})

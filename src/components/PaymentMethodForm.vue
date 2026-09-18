<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 480px; max-width: 90vw; border-radius: 8px;">
      <q-card-section class="row items-center justify-between q-pb-none q-pt-md q-px-lg">
        <div class="text-h6">{{ isEdit ? "Editar" : "Nuevo" }} Método de Pago</div>
        <q-btn icon="close" flat round dense v-close-popup :disable="paymentStore.isLoading">
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="formData.name"
            label="Nombre *"
            :disable="paymentStore.isLoading"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'El nombre es obligatorio']"
          />

          <q-select
            filled
            v-model="formData.type"
            :options="typeOptions"
            label="Tipo de Método *"
            :disable="paymentStore.isLoading"
            emit-value
            map-options
            lazy-rules
            :rules="[val => !!val || 'El tipo es obligatorio']"
          />

          <q-input
            filled
            v-model="formData.description"
            label="Descripción (Opcional)"
            type="textarea"
            rows="3"
            :disable="paymentStore.isLoading"
          />

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn
              flat
              label="Cancelar"
              color="grey-8"
              :disable="paymentStore.isLoading"
              v-close-popup
            />
            <q-btn
              unelevated
              :label="isEdit ? 'Guardar' : 'Crear'"
              type="submit"
              color="primary"
              :loading="paymentStore.isLoading"
              :disable="paymentStore.isLoading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { usePaymentStore } from "../stores/paymentStore"
import { typeOptions } from "../utils/formatters"
import type { PaymentMethod } from "../types"

interface PaymentMethodFormData {
  name: string
  type: PaymentMethod["type"] | ""
  description: string
}

const props = defineProps<{
  modelValue: boolean
  editData?: PaymentMethod | null
}>()

const emit = defineEmits(["update:modelValue", "saved"])
const paymentStore = usePaymentStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})

const isEdit = computed(() => !!props.editData)

const formData = ref<PaymentMethodFormData>({
  name: "",
  type: "",
  description: ""
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.editData) {
      formData.value = {
        name: props.editData.name,
        type: props.editData.type,
        description: props.editData.description || ""
      }
    } else {
      formData.value = { name: "", type: "", description: "" }
    }
  }
})

/**
 * Handle save/update payment method
 */
const onSubmit = async () => {
  if (!formData.value.type) return

  let success = false
  const payload = {
    name: formData.value.name,
    type: formData.value.type as PaymentMethod["type"],
    description: formData.value.description
  }

  if (isEdit.value && props.editData) {
    success = await paymentStore.updateMethod(props.editData.id, payload)
  } else {
    success = await paymentStore.createMethod(payload)
  }

  if (success) {
    isOpen.value = false
    emit("saved")
  }
}
</script>

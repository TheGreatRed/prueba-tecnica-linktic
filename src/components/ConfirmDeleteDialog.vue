<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 440px; max-width: 90vw; border-radius: 8px;">
      <q-card-section class="row items-center justify-between q-pb-none q-pt-md q-px-lg">
        <div class="text-subtitle1 text-weight-bold text-grey-9">Confirmar Eliminación</div>
        <q-btn icon="close" flat round dense v-close-popup :disable="paymentStore.isLoading">
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section class="row items-center no-wrap q-pa-lg">
        <q-avatar icon="warning" color="negative" text-color="white" size="44px" class="q-mr-md flex-shrink-0" />
        <div class="text-body1 text-grey-9 text-weight-medium">
          ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-lg q-pb-md">
        <q-btn
          flat
          label="Cancelar"
          color="grey-8"
          :disable="paymentStore.isLoading"
          v-close-popup
        />
        <q-btn
          unelevated
          label="Eliminar"
          color="negative"
          @click="onConfirm"
          :loading="paymentStore.isLoading"
          :disable="paymentStore.isLoading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { usePaymentStore } from "../stores/paymentStore"

const props = defineProps<{
  modelValue: boolean
  itemId: string
}>()

const emit = defineEmits(["update:modelValue", "deleted"])
const paymentStore = usePaymentStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
})

/**
 * Handle confirmation of deletion
 */
const onConfirm = async () => {
  const success = await paymentStore.deleteMethod(props.itemId)
  if (success) {
    isOpen.value = false
    emit("deleted")
  }
}
</script>

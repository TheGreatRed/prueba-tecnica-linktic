<template>
  <q-page padding>
    <div class="row items-center justify-between q-col-gutter-y-md q-mb-md">
      <div class="col-12 col-sm-auto text-h5 text-sm-h4 text-weight-bold text-primary">
        Métodos de Pago
      </div>
      <div class="col-12 col-sm-auto row q-gutter-sm items-center justify-start justify-sm-end">
        <q-btn outline color="primary" icon="restart_alt" label="Restablecer Datos" :loading="isResetLoading"
          :disable="paymentStore.isLoading" @click="confirmResetData" class="col-grow col-sm-auto">
          <q-tooltip>Recargar datos de prueba iniciales</q-tooltip>
        </q-btn>
        <q-btn color="primary" icon="add" label="Nuevo Método" unelevated :disable="paymentStore.isLoading"
          @click="openCreateForm" class="col-grow col-sm-auto" />
      </div>
    </div>

    <GenericFilter ref="filterRef" :fields="filterConfig" :loading="paymentStore.isLoading"
      :disable="paymentStore.paymentMethods.length === 0" @search="handleSearch" @clear="handleClear" />

    <q-table flat bordered :rows="filteredRows" :columns="columns" row-key="id" :loading="paymentStore.isLoading"
      loading-label="Cargando métodos de pago..." no-data-label="No hay métodos de pago registrados"
      no-results-label="No se encontraron métodos de pago con los filtros seleccionados"
      rows-per-page-label="Registros por página:" :rows-per-page-options="[5, 10, 20, 0]"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`"
      :pagination="{ rowsPerPage: 10 }">
      <template v-slot:loading>
        <q-inner-loading showing color="primary">
          <q-spinner-dots size="48px" color="primary" />
          <span class="q-mt-sm text-primary text-weight-medium">Cargando información...</span>
        </q-inner-loading>
      </template>

      <template v-slot:no-data>
        <template v-if="!paymentStore.isLoading">
          <!-- Estado 1: Base de datos totalmente vacía (0 registros) -->
          <div v-if="paymentStore.paymentMethods.length === 0"
            class="full-width column flex-center q-pa-md q-pa-sm-xl text-grey-8 text-center">
            <q-icon name="inventory_2" size="48px" color="grey-5" class="q-mb-sm" />
            <div class="text-subtitle1 text-weight-medium q-mb-xs">
              No hay métodos de pago registrados
            </div>
            <div class="text-caption text-grey-6 q-mb-md" style="max-width: 320px;">
              Puedes agregar uno nuevo o restablecer los datos de demostración
            </div>
            <div class="row q-col-gutter-sm justify-center items-center full-width" style="max-width: 420px;">
              <div class="col-12 col-sm-auto">
                <q-btn color="primary" icon="add" label="Nuevo Método" unelevated :disable="paymentStore.isLoading"
                  @click="openCreateForm" class="full-width" />
              </div>
              <div class="col-12 col-sm-auto">
                <q-btn outline color="primary" icon="restart_alt" label="Restablecer Datos"
                  :loading="isResetLoading" :disable="paymentStore.isLoading" @click="confirmResetData"
                  class="full-width" />
              </div>
            </div>
          </div>

          <!-- Estado 2: Hay registros en el sistema, pero el filtro/búsqueda no arrojó coincidencias -->
          <div v-else
            class="full-width column flex-center q-pa-md q-pa-sm-xl text-grey-8 text-center">
            <q-icon name="search_off" size="48px" color="grey-5" class="q-mb-sm" />
            <div class="text-subtitle1 text-weight-medium q-mb-xs">
              No se encontraron resultados
            </div>
            <div class="text-caption text-grey-6 q-mb-md" style="max-width: 320px;">
              No hay métodos de pago que coincidan con los criterios de búsqueda aplicados
            </div>
            <q-btn outline color="primary" icon="filter_alt_off" label="Limpiar Filtros"
              :disable="paymentStore.isLoading" @click="handleResetFilters" />
          </div>
        </template>
      </template>

      <template v-slot:body-cell-isActive="props">
        <q-td :props="props">
          <q-toggle v-model="props.row.isActive" color="positive" :disable="paymentStore.isLoading"
            @update:model-value="toggleStatus(props.row)" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn flat round dense color="primary" icon="edit" :disable="paymentStore.isLoading"
            @click="openEditForm(props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn flat round dense color="negative" icon="delete" :disable="paymentStore.isLoading"
            @click="openDeleteDialog(props.row.id)">
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <PaymentMethodForm v-model="isFormOpen" :edit-data="selectedMethod" />
    <ConfirmDeleteDialog v-model="isDeleteDialogOpen" :item-id="methodToDelete" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { usePaymentStore } from "../stores/paymentStore"
import GenericFilter, { type FilterField } from "../components/GenericFilter.vue"
import PaymentMethodForm from "../components/PaymentMethodForm.vue"
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog.vue"
import { formatType, formatDate, typeOptions } from "../utils/formatters"
import type { PaymentMethod } from "../types"
import { Dialog } from "quasar"

const paymentStore = usePaymentStore()

const filterConfig: FilterField[] = [
  { name: "name", label: "Buscar por nombre", type: "text" },
  { name: "type", label: "Tipo de método", type: "select", options: typeOptions },
  {
    name: "status", label: "Estado", type: "select", options: [
      { label: "Activo", value: "active" },
      { label: "Inactivo", value: "inactive" }
    ]
  }
]

const filterRef = ref<InstanceType<typeof GenericFilter> | null>(null)
const activeFilters = ref<Record<string, any>>({})
const isResetLoading = ref(false)

const columns = [
  { name: "name", label: "Nombre", field: "name", sortable: true, align: "left" as const },
  { name: "type", label: "Tipo", field: "type", sortable: true, align: "left" as const, format: (val: string) => formatType(val) },
  { name: "isActive", label: "Estado", field: "isActive", align: "center" as const },
  { name: "createdAt", label: "Fecha de creación", field: "createdAt", sortable: true, align: "left" as const, format: (val: string) => formatDate(val) },
  { name: "actions", label: "Acciones", field: "actions", align: "center" as const }
]

const isFormOpen = ref(false)
const selectedMethod = ref<PaymentMethod | null>(null)
const isDeleteDialogOpen = ref(false)
const methodToDelete = ref<string>("")

const isAnyModalOpen = computed(() => isFormOpen.value || isDeleteDialogOpen.value)

/**
 * Handles browser back button to close any open modal
 */
const handlePopState = () => {
  if (isFormOpen.value) isFormOpen.value = false
  if (isDeleteDialogOpen.value) isDeleteDialogOpen.value = false
}

watch(isAnyModalOpen, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    window.history.pushState({ modalOpen: true }, "")
  } else if (!newVal && oldVal) {
    if (window.history.state?.modalOpen) {
      window.history.back()
    }
  }
})

onMounted(() => {
  paymentStore.fetchPaymentMethods()
  window.addEventListener("popstate", handlePopState)
})

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState)
})

const filteredRows = computed(() => {
  let result = [...paymentStore.paymentMethods]
  const filters = activeFilters.value

  if (filters.name) {
    result = result.filter(r => r.name.toLowerCase().includes(filters.name.toLowerCase()))
  }
  if (filters.type) {
    result = result.filter(r => r.type === filters.type)
  }
  if (filters.status) {
    const isActiveFilter = filters.status === "active"
    result = result.filter(r => r.isActive === isActiveFilter)
  }

  return result
})

/**
 * Prompts confirmation dialog before resetting data
 */
const confirmResetData = () => {
  Dialog.create({
    title: "Restablecer Datos de Prueba",
    message: `
      <div class="row items-center no-wrap q-pt-xs">
        <div class="q-avatar bg-primary text-white q-mr-md" style="width: 44px; height: 44px; min-width: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <i class="material-icons" style="font-size: 24px;">restart_alt</i>
        </div>
        <div class="text-body1 text-grey-9 text-weight-medium">
          ¿Estás seguro de que deseas restablecer los datos de prueba? Se reemplazarán los registros actuales con la información inicial de demostración.
        </div>
      </div>
    `,
    html: true,
    cancel: {
      label: "Cancelar",
      flat: true,
      color: "grey-8"
    },
    ok: {
      label: "Restablecer",
      color: "primary",
      unelevated: true
    },
    persistent: true
  }).onOk(() => {
    handleReset()
  })
}

/**
 * Handles resetting demo data with specific loading state
 */
const handleReset = async () => {
  isResetLoading.value = true
  try {
    await paymentStore.resetToDefault()
  } finally {
    isResetLoading.value = false
  }
}

/**
 * Updates active filters from GenericFilter search event
 */
const handleSearch = (filters: Record<string, any>) => {
  activeFilters.value = filters
}

/**
 * Resets active filters on GenericFilter clear event
 */
const handleClear = () => {
  activeFilters.value = {}
}

/**
 * Resets filter form and active filters
 */
const handleResetFilters = () => {
  if (filterRef.value) {
    filterRef.value.reset()
  } else {
    handleClear()
  }
}

/**
 * Toggles payment method active/inactive state
 */
const toggleStatus = async (method: PaymentMethod) => {
  await paymentStore.updateMethod(method.id, { isActive: method.isActive })
}

/**
 * Opens form in create mode
 */
const openCreateForm = () => {
  selectedMethod.value = null
  isFormOpen.value = true
}

/**
 * Opens form in edit mode with selected payment method data
 */
const openEditForm = (method: PaymentMethod) => {
  selectedMethod.value = { ...method }
  isFormOpen.value = true
}

/**
 * Opens confirm delete dialog for given id
 */
const openDeleteDialog = (id: string) => {
  methodToDelete.value = id
  isDeleteDialogOpen.value = true
}
</script>

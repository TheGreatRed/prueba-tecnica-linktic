<template>
  <q-card class="q-mb-md shadow-1">
    <q-card-section>
      <div class="text-subtitle1 text-weight-bold q-mb-sm">Filtros de Búsqueda</div>
      <q-form ref="filterFormRef" @submit.prevent="onSearch" @reset="onClear" class="row q-col-gutter-md items-start">
        
        <template v-for="field in fields" :key="field.name">
          <!-- Text Input -->
          <div v-if="field.type === 'text'" :class="getFieldColumnClass(fields.length)">
            <q-input
              outlined
              dense
              v-model="formData[field.name]"
              :label="field.label + (field.required ? ' *' : '')"
              clearable
              hide-bottom-space
              :disable="isDisabled"
              :rules="field.required ? [val => (val !== null && val !== undefined && String(val).trim() !== '') || 'Este campo es obligatorio'] : []"
              lazy-rules="ondemand"
              @clear="onFieldClear(field.name)"
            />
          </div>

          <!-- Select -->
          <div v-else-if="field.type === 'select'" :class="getFieldColumnClass(fields.length)">
            <q-select
              outlined
              dense
              v-model="formData[field.name]"
              :options="field.options"
              :label="field.label + (field.required ? ' *' : '')"
              emit-value
              map-options
              clearable
              hide-bottom-space
              :disable="isDisabled"
              :rules="field.required ? [val => (val !== null && val !== undefined && val !== '') || 'Este campo es obligatorio'] : []"
              lazy-rules="ondemand"
              @clear="onFieldClear(field.name)"
            />
          </div>
        </template>

        <!-- Actions -->
        <div class="col-12 row q-gutter-sm q-mt-xs">
          <q-btn
            label="Buscar"
            type="submit"
            color="primary"
            icon="search"
            :disable="isDisabled"
            unelevated
          />
          <q-btn
            label="Limpiar"
            type="reset"
            color="grey-7"
            outline
            icon="clear"
            :disable="isDisabled || !hasActiveValues"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import type { QForm } from "quasar"

export interface FilterField {
  name: string
  label: string
  type: "text" | "select"
  required?: boolean
  options?: { label: string; value: any }[]
}

const props = withDefaults(
  defineProps<{
    fields: FilterField[]
    loading?: boolean
    disable?: boolean
  }>(),
  {
    loading: false,
    disable: false
  }
)

const emit = defineEmits<{
  (e: "search", filters: Record<string, any>): void
  (e: "clear"): void
}>()

const filterFormRef = ref<InstanceType<typeof QForm> | null>(null)
const formData = ref<Record<string, any>>({})

const isDisabled = computed(() => props.loading || props.disable)

/**
 * Calculates responsive column class based on number of fields
 */
const getFieldColumnClass = (totalFields: number) => {
  const cols = Math.max(1, Math.min(totalFields, 4))
  return `col-12 col-sm-6 col-md-${Math.floor(12 / cols)}`
}

/**
 * Initializes form data values
 */
const initForm = () => {
  const initial: Record<string, any> = {}
  props.fields.forEach(f => {
    initial[f.name] = null
  })
  formData.value = initial
}

watch(() => props.fields, initForm, { immediate: true })

/**
 * Checks if at least one filter field contains a value
 */
const hasActiveValues = computed(() => {
  return Object.values(formData.value).some(
    val => val !== null && val !== undefined && String(val).trim() !== ""
  )
})

/**
 * Validates fields and emits search payload
 */
const onSearch = async () => {
  if (filterFormRef.value) {
    const isValid = await filterFormRef.value.validate()
    if (!isValid) {
      return
    }
  }

  // Clean empty values
  const payload: Record<string, any> = {}
  Object.keys(formData.value).forEach(key => {
    const val = formData.value[key]
    if (val !== null && val !== undefined && val !== "") {
      payload[key] = val
    }
  })

  emit("search", payload)
}

/**
 * Resets form values and validation state
 */
/**
 * Handles clearing a single input via its clearable 'X' icon
 */
const onFieldClear = (fieldName: string) => {
  formData.value[fieldName] = null

  const payload: Record<string, any> = {}
  Object.keys(formData.value).forEach(key => {
    const val = formData.value[key]
    if (val !== null && val !== undefined && String(val).trim() !== "") {
      payload[key] = val
    }
  })

  if (Object.keys(payload).length === 0) {
    onClear()
  } else {
    emit("search", payload)
  }
}

const onClear = () => {
  initForm()
  if (filterFormRef.value) {
    filterFormRef.value.resetValidation()
  }
  emit("clear")
}

defineExpose({
  reset: onClear
})
</script>

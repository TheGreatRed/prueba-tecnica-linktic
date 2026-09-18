import { mount } from "@vue/test-utils"
import { describe, it, expect } from "vitest"
import GenericFilter from "../GenericFilter.vue"
import { Quasar } from "quasar"

describe("GenericFilter", () => {
  const mockFields = [
    { name: "query", label: "Buscar", type: "text", required: true },
    { name: "status", label: "Estado", type: "select", options: [{ label: "Activo", value: "active" }] }
  ]

  it("monta correctamente con los campos dinámicos", () => {
    const wrapper = mount(GenericFilter, {
      props: { fields: mockFields as any },
      global: { plugins: [Quasar] }
    })
    
    // Verifica que los labels existen
    expect(wrapper.text()).toContain("Buscar")
    expect(wrapper.text()).toContain("Estado")
  })

  it("detiene la emisión de search si falta un campo requerido", async () => {
    const wrapper = mount(GenericFilter, {
      props: { fields: mockFields as any },
      global: { plugins: [Quasar] }
    })
    
    await wrapper.find("form").trigger("submit")
    // No debe haberse emitido el evento search
    expect(wrapper.emitted("search")).toBeFalsy()
  })
})

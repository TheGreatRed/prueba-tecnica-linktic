export const formatType = (type: string) => {
  const types: Record<string, string> = {
    credit_card: "Tarjeta de Crédito",
    debit_card: "Tarjeta de Débito",
    bank_transfer: "Transf. Bancaria",
    cash: "Efectivo",
    digital_wallet: "Billetera Digital"
  }
  return types[type] || type
}

export const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric", month: "short", day: "numeric"
  })
}

export const typeOptions = [
  { label: "Tarjeta de Crédito", value: "credit_card" },
  { label: "Tarjeta de Débito", value: "debit_card" },
  { label: "Transferencia Bancaria", value: "bank_transfer" },
  { label: "Efectivo", value: "cash" },
  { label: "Billetera Digital", value: "digital_wallet" }
]

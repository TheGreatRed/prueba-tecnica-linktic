export interface PaymentMethod {
  id: string
  name: string
  type: "credit_card" | "debit_card" | "bank_transfer" | "cash" | "digital_wallet"
  isActive: boolean
  createdAt: string
  description?: string
}

export interface User {
  id: string
  username: string
  name: string
}

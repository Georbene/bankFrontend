import api from "./api"

export const getTransactions = async () => {
  try {
    const response = await api.get("/api/transactions")
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch transactions",
    }
  }
}

export const transferFunds = async (data) => {
  try {
    const response = await api.post("/api/transactions/transfer", data)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Transfer failed",
    }
  }
}

export const getAccountBalance = async () => {
  try {
    const response = await api.get("/api/accounts/balance")
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch balance",
    }
  }
}

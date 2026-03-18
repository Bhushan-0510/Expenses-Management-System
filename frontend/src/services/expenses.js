import api from "./apiClient.js";

export async function addExpense(payload) {
  const { data } = await api.post("/expenses", payload);
  return data;
}

export async function fetchExpenses(params = {}) {
  const { data } = await api.get("/expenses", { params });
  return data;
}

export async function updateExpense(id, payload) {
  const { data } = await api.put(`/expenses/${id}`, payload);
  return data;
}

export async function deleteExpense(id) {
  const { data } = await api.delete(`/expenses/${id}`);
  return data;
}


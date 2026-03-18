import api from "./apiClient.js";

export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data;
}

export async function createCategory(name) {
  const { data } = await api.post("/categories", { name });
  return data;
}


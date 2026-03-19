import api from "./apiClient.js";

const TOKEN_KEY = "pea_jwt";
const USER_KEY = "pea_user";

function getStorage(remember) {
  if (typeof window === "undefined") return null;
  return remember ? window.localStorage : window.sessionStorage;
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token, remember) {
  const storage = getStorage(remember);
  if (!storage) return;
  storage.setItem(TOKEN_KEY, token);
}

export function setUser(user, remember) {
  const storage = getStorage(remember);
  if (!storage) return;
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY) || window.sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(USER_KEY);
}

export async function register(email, password, remember = true) {
  try {
    const { data } = await api.post("/auth/register", { email, password });
    if (data.token) setToken(data.token, remember);
    if (data.user) setUser(data.user, remember);
    return data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Unable to register";
    throw new Error(message);
  }
}

export async function login(email, password, remember = true) {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.token) setToken(data.token, remember);
    if (data.user) setUser(data.user, remember);
    return data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || "Unable to login";
    throw new Error(message);
  }
}


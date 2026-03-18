import axios from "axios";
import { getToken } from "./auth.js";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


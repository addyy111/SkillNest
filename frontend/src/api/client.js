import axios from "axios";

// Environment-driven API URL with fallback to local development
const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const API_BASE_URL = RAW_URL.replace(/\/+$/, "");
export const API_BASE = `${API_BASE_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;


import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://smart-lead-system-five.vercel.app";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const processBatch = async (names) => {
  const response = await api.post("/api/process", { names });
  return response.data;
};

export const getAllLeads = async (status = "") => {
  const response = await api.get(`/api/leads${status ? `?status=${status}` : ""}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/api/stats");
  return response.data;
};

export default api;
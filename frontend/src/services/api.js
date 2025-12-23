import axios from "axios";

// Vite env variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const processBatch = async (names) => {
  const response = await api.post("/process", { names });
  return response.data;
};

export const getAllLeads = async (status = "") => {
  const response = await api.get(`/leads${status ? `?status=${status}` : ""}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/stats");
  return response.data;
};

export default api;

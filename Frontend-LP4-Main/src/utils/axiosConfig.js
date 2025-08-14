// src/utils/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true // 🔐 envía cookies automáticamente
});

export default api;

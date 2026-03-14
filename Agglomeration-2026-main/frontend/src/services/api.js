import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

// Upload single image
export const uploadSingleImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/api/upload", formData);

  return response.data;
};

// Upload multiple images
export const uploadBatchImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post("/api/batch", formData);

  return response.data;
};

// Get analytics data
export const getAnalytics = async () => {
  const response = await api.get("/api/analytics");
  return response.data;
};

// Export report as PDF
export const exportPDF = async () => {
  const response = await api.get("/api/export/pdf", {
    responseType: "blob",
  });
  return response.data;
};

// Export report as Excel
export const exportExcel = async () => {
  const response = await api.get("/api/export/excel", {
    responseType: "blob",
  });
  return response.data;
};

export default api;

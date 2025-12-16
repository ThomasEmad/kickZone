import axios from "axios";
import config from "../config/environment";

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: config.apiUrl || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use(
  (request) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error),
);

// Handle responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  },
);

// Auth API endpoints
export const authAPI = {
  login: (email, password) =>
    axiosInstance.post("/account/login/", { email, password }),

  register: (userData) => axiosInstance.post("/account/register/", userData),

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },
};

// Pitches API endpoints
export const pitchesAPI = {
  getAll: (params = {}) => axiosInstance.get("/pitches/"),

  getById: (id) => axiosInstance.get(`/pitches/${id}/`),

  create: (data) => axiosInstance.post("/pitches/", data),

  update: (id, data) => axiosInstance.put(`/pitches/${id}/`, data),

  delete: (id) => axiosInstance.delete(`/pitches/${id}/`),
};

// Locations/Filters API endpoints
export const locationsAPI = {
  getGovernorates: () => axiosInstance.get(`/pitches/governorates/`),

  getCities: (governorateId) =>
    axiosInstance.get("/pitches/cities/", {
      params: { governorate_id: governorateId },
    }),

  getAreas: () => axiosInstance.get("/pitches/areas/"),

  getAllFilters: () => axiosInstance.get("/pitches/all/"),
};

// User profile API endpoints
export const userAPI = {
  getProfile: () => axiosInstance.get(`/account/profile/${id}/`),

  updateProfile: (data) => axiosInstance.put(`/account/profile/${id}/`, data),

  changePassword: (data) =>
    axiosInstance.post(`/account/profile/${id}/change-password/`, data),
};

export default axiosInstance;

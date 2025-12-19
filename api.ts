import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post("/api/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),
  verify: () => api.get("/api/auth/verify"),
};

// Users API
export const usersApi = {
  getMe: () => api.get("/api/users/me"),
  updateMe: (data: { name?: string; avatar?: string }) =>
    api.put("/api/users/me", data),
};

// Projects API
export const projectsApi = {
  getAll: () => api.get("/api/projects"),
  getById: (id: string) => api.get(`/api/projects/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post("/api/projects", data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put(`/api/projects/${id}`, data),
  delete: (id: string) => api.delete(`/api/projects/${id}`),
};

// Recordings API
export const recordingsApi = {
  getAll: (projectId?: string) =>
    api.get("/api/recordings", { params: { projectId } }),
  getById: (id: string) => api.get(`/api/recordings/${id}`),
  create: (data: any) => api.post("/api/recordings", data),
  update: (id: string, data: any) => api.put(`/api/recordings/${id}`, data),
  delete: (id: string) => api.delete(`/api/recordings/${id}`),
};

// Feedback API
export const feedbackApi = {
  getAll: (params?: {
    projectId?: string;
    recordingId?: string;
    type?: string;
  }) => api.get("/api/feedback", { params }),
  getById: (id: string) => api.get(`/api/feedback/${id}`),
  create: (data: any) => api.post("/api/feedback", data),
  update: (id: string, data: any) => api.put(`/api/feedback/${id}`, data),
  delete: (id: string) => api.delete(`/api/feedback/${id}`),
};

// Insights API
export const insightsApi = {
  getAll: (params?: {
    projectId?: string;
    recordingId?: string;
    type?: string;
  }) => api.get("/api/insights", { params }),
  getById: (id: string) => api.get(`/api/insights/${id}`),
  generate: (data: any) => api.post("/api/insights/generate", data),
  delete: (id: string) => api.delete(`/api/insights/${id}`),
};

export default api;

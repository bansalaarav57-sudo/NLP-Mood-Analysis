import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/signup", data),
};

export const predictionService = {
  predict: (review) =>
    api.post("/prediction/predict", {
      review,
    }),
};

export const dashboardService = {
  getSummary: () => api.get("/dashboard/"),
};

export const reportService = {
  getHistory: () => api.get("/reports/history"),
  getSummary: () => api.get("/reports/summary"),
};

export default api;
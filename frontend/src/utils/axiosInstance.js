import axios from "axios";
import store from "../store";
import { logout } from "../store/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const requestPath = originalRequest.url;
      
      if (requestPath?.includes("/auth/login") || requestPath?.includes("/auth/register") || requestPath?.includes("/auth/verify")) {
        return Promise.reject(error);
      }

      if (requestPath === "/auth/refresh" || requestPath?.includes("/auth/refresh")) {
        isRefreshing = false;
        processQueue(error);
        store.dispatch(logout());
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh");
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err); 
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          console.error("Bad request", data);
          break;
        case 403:
          console.error("Forbidden", data);
          break;
        case 404:
          console.error("Not found", data);
          break;
        case 500:
          console.error("Server error", data);
          break;
        default:
          console.error(`Error ${status}`, data);
      }
    } else if (error.request) {
      console.error("Network Error: No response received", error.request);
    } else {
      console.error("Error", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

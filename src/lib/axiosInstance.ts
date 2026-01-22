// src/lib/api/axiosInstance.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { logout } from "@/lib/features/auth/authSlice";

type ReduxStore = {
  dispatch: (action: unknown) => void;
};

// ── Let the store be injected later ──
let reduxStore: ReduxStore | null = null;
export const injectStore = (store: ReduxStore) => {
  reduxStore = store;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"; // fallback for safety

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – adds token from cookie
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Prevent multiple simultaneous 401 handling
let isAlreadyHandling401 = false;

// Response interceptor – handles 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAlreadyHandling401
    ) {
      isAlreadyHandling401 = true;
      originalRequest._retry = true; // prevent retry loop

      try {
        // Clear auth data
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");

        // Dispatch logout if store is already injected
        if (reduxStore) {
          reduxStore.dispatch(logout());
        }

        // Show toast (only in browser)
        if (typeof window !== "undefined") {
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            duration: 5000,
          });
        }

        // Redirect (only in browser)
        // if (typeof window !== "undefined") {
        //   window.location.href = "/signin";
        // }

        return Promise.reject(error);
      } finally {
        isAlreadyHandling401 = false;
      }
    }

    // Pass all other errors through
    return Promise.reject(error);
  }
);

// Reusable typed request helper (used in thunks)
export const apiRequest = async <T = any>(
  config: {
    method: "get" | "post" | "put" | "patch" | "delete";
    url: string;
    data?: unknown;
    params?: Record<string, unknown>;
  }
): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>(config);
    console.log("API Request:", response.data);
    return response.data;
  } catch (err) {
  if (axios.isAxiosError(err)) {
    throw err.response?.data ?? { message: "Network error" };
  }
  throw { message: "Unknown error" };
}
};

export default axiosInstance;
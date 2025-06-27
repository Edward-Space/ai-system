import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { getTokenUser } from "@/action/AuthAction";
import { getCookie } from "cookies-next/client";

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 20000,
  withCredentials: true, // Tự động gửi cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Tự động thêm token và headers
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Thêm Authorization header nếu có token
      const token =
        typeof window == "undefined"
          ? await getTokenUser()
          : getCookie("access_token");

          
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý response và errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Xử lý lỗi 401 (Unauthorized)
    // if (error.response?.status === 401 && !originalRequest?._retry) {
    //   if (originalRequest) {
    //     originalRequest._retry = true;
    //   }

    //   // Có thể thêm logic refresh token ở đây nếu cần
    //   // Hiện tại chỉ redirect về login
    //   if (typeof window !== 'undefined') {
    //     window.location.href = '/vi/login';
    //   }
    // }

    // Xử lý các lỗi khác
    if (error.response?.status === 403) {
      console.error("Forbidden: Không có quyền truy cập");
    }

    if (error.response && error.response.status >= 500) {
      console.error("Server Error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// Export các methods tiện ích
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
};

// Export axios instance để sử dụng trực tiếp nếu cần
export default axiosInstance;

// Export types để sử dụng
export type { AxiosResponse, AxiosError };
export type { AxiosRequestConfig } from "axios";

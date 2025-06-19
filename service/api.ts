import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ErrorResponse } from '../model';

// Cấu hình mặc định cho axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 30000; // 30 seconds

/**
 * Tạo instance axios với cấu hình mặc định
 */
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...config,
  });

  // Interceptor cho request
  axiosInstance.interceptors.request.use(
    (config) => {
      // Thêm token vào header nếu có
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor cho response
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ErrorResponse>) => {
      // Xử lý lỗi response
      const errorResponse: ErrorResponse = {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Đã xảy ra lỗi không xác định',
        errors: error.response?.data?.errors,
      };

      // Xử lý lỗi 401 (Unauthorized)
      if (error.response?.status === 401) {
        // Xóa token và redirect về trang login nếu ở client-side
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Redirect về trang login nếu cần
          // window.location.href = '/login';
        }
      }

      return Promise.reject(errorResponse);
    }
  );

  return axiosInstance;
};

// Instance mặc định
const apiClient = createAxiosInstance();

/**
 * Các phương thức API
 */
export const apiService = {
  /**
   * Gửi request GET
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  /**
   * Gửi request POST
   */
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  /**
   * Gửi request PUT
   */
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  /**
   * Gửi request PATCH
   */
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  /**
   * Gửi request DELETE
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data;
  },

  /**
   * Tạo instance axios mới với cấu hình tùy chỉnh
   */
  createInstance: createAxiosInstance,
};

export default apiService;
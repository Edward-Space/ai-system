import axiosInstance, { apiClient } from '@/lib/axios';
import { AxiosRequestConfig } from 'axios';

// GET method với axios
export const GET = async <T>(url: string, config?: AxiosRequestConfig): Promise<T | undefined> => {
  try {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  } catch (error) {
    console.error('GET request error:', error);
   return undefined;
  }
};

// POST method với axios
export const POST = async <T>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T | undefined> => {
  try {
    const response = await axiosInstance.post<T>(url, payload, config);
    return response.data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

// PUT method với axios
export const PUT = async <T>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T | undefined> => {
  try {
    const response = await axiosInstance.put<T>(url, payload, config);
    return response.data;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

// PATCH method với axios
export const PATCH = async <T>(url: string, payload?: any, config?: AxiosRequestConfig): Promise<T | undefined> => {
  try {
    const response = await axiosInstance.patch<T>(url, payload, config);
    return response.data;
  } catch (error) {
    console.error('PATCH request error:', error);
    throw error;
  }
};

// DELETE method với axios
export const DELETE = async <T>(url: string, config?: AxiosRequestConfig): Promise<T | undefined> => {
  try {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};

// Export apiClient để sử dụng trực tiếp
export { apiClient };

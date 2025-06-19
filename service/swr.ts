import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationConfiguration, SWRMutationResponse } from 'swr/mutation';
import { ApiResponse, ErrorResponse, PaginatedResponse } from '../model';
import apiService from './api';

/**
 * Fetcher mặc định cho SWR
 */
const defaultFetcher = async <T>(url: string): Promise<T> => {
  try {
    const response = await apiService.get<T>(url);
    return response.data;
  } catch (error) {
    throw error as ErrorResponse;
  }
};

/**
 * Hook sử dụng SWR để fetch dữ liệu
 */
export function useApi<T>(
  url: string | null,
  config?: SWRConfiguration
): SWRResponse<T, ErrorResponse> {
  return useSWR<T, ErrorResponse>(
    url,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      ...config,
    }
  );
}

/**
 * Hook sử dụng SWR để fetch dữ liệu có phân trang
 */
export function usePaginatedApi<T>(
  url: string | null,
  config?: SWRConfiguration
): SWRResponse<PaginatedResponse<T>, ErrorResponse> {
  return useSWR<PaginatedResponse<T>, ErrorResponse>(
    url,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      ...config,
    }
  );
}

/**
 * Các hàm mutation cho SWR
 */
const mutations = {
  post: async <T>(url: string, { arg }: { arg: any }): Promise<T> => {
    const response = await apiService.post<T>(url, arg);
    return response.data;
  },
  put: async <T>(url: string, { arg }: { arg: any }): Promise<T> => {
    const response = await apiService.put<T>(url, arg);
    return response.data;
  },
  patch: async <T>(url: string, { arg }: { arg: any }): Promise<T> => {
    const response = await apiService.patch<T>(url, arg);
    return response.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiService.delete<T>(url);
    return response.data;
  },
};

/**
 * Hook sử dụng SWR Mutation để thực hiện POST request
 */
export function usePostMutation<T, D = any>(
  url: string,
  config?: SWRMutationConfiguration<T, ErrorResponse, string, D>
): SWRMutationResponse<T, ErrorResponse, string, D> {
  return useSWRMutation<T, ErrorResponse, string, D>(
    url,
    mutations.post,
    config
  );
}

/**
 * Hook sử dụng SWR Mutation để thực hiện PUT request
 */
export function usePutMutation<T, D = any>(
  url: string,
  config?: SWRMutationConfiguration<T, ErrorResponse, string, D>
): SWRMutationResponse<T, ErrorResponse, string, D> {
  return useSWRMutation<T, ErrorResponse, string, D>(
    url,
    mutations.put,
    config
  );
}

/**
 * Hook sử dụng SWR Mutation để thực hiện PATCH request
 */
export function usePatchMutation<T, D = any>(
  url: string,
  config?: SWRMutationConfiguration<T, ErrorResponse, string, D>
): SWRMutationResponse<T, ErrorResponse, string, D> {
  return useSWRMutation<T, ErrorResponse, string, D>(
    url,
    mutations.patch,
    config
  );
}

/**
 * Hook sử dụng SWR Mutation để thực hiện DELETE request
 */
export function useDeleteMutation<T>(
  url: string,
  config?: SWRMutationConfiguration<T, ErrorResponse, string, null>
): SWRMutationResponse<T, ErrorResponse, string, null> {
  return useSWRMutation<T, ErrorResponse, string, null>(
    url,
    mutations.delete,
    config
  );
}

/**
 * Export tất cả các hooks và utilities
 */
export const swrService = {
  useApi,
  usePaginatedApi,
  usePostMutation,
  usePutMutation,
  usePatchMutation,
  useDeleteMutation,
};

export default swrService;
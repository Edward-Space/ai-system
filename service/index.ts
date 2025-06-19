import apiService from './api';
import swrService from './swr';

export { apiService, swrService };

// Re-export các hooks từ SWR service để dễ sử dụng
export const {
  useApi,
  usePaginatedApi,
  usePostMutation,
  usePutMutation,
  usePatchMutation,
  useDeleteMutation,
} = swrService;

// Export default apiService để sử dụng ở server-side
export default apiService;
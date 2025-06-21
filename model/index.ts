// Common interfaces for API responses

import { PublicConfiguration } from "swr/_internal";

// Base API response interface
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}

// Pagination metadata interface
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Paginated response interface
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

// Error response interface
export interface ErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse<{
  user: User;
  token: string;
}> {}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface RegisterResponse extends ApiResponse<{
  user: User;
  token: string;
}> {}

export type TFetchHeaders = {
  cache: RequestCache;
  next: { revalidate: number; tags: string[] };
  headers: {
    'Content-Type': string;
    Authorization: string;
    'x-api-key': string;
  };
};

export type TResponseData<T = unknown> = {
  data?: T;
  // meta?: TMeta;
  message?: string;
  status?: string;
  status_code?: number;
  error?: {
    errors: {
      msg: string;
    };
  };
};

type TParams = string | string[][] | Record<string, string> | URLSearchParams | undefined;

type TOptionHook<Data = unknown> = {
  params?: TParams;
  isFetch?: boolean;
  config?: Partial<PublicConfiguration<Data | undefined, unknown, any>>;
  onSuccess?: (data: Data,meta?: TMeta) => void;
  onError?: (error: unknown) => void;
};

type TOptionFetchDataHook<Data = unknown> = TOptionHook<Data> & {
  key: string;
}

type TMeta = {
  pagination: {
    count?: number;
    current_page?: number;
    per_page?: number;
    total: number;
    total_pages: number;
  };
};

export type {
  TOptionHook,
  TOptionFetchDataHook,
  TParams,
  TMeta
}